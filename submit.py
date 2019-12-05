import gaipy as gp
import json
def submit(category,tags,text_id):
    db_name = "doc_tag"
    res = gp.ExactSearch(db_name,col='text_id',pattern=str(text_id),mode='json')
    ret = json.loads(res)
    ret = json.loads(ret['data'])
    rid = ret['recs'][0]['rid']
    tags_set = set(tags)
    tags_list = ','.join(tags_set)
    res = gp.Update(db=db_name,rid=rid,new_record={'category':category,'confirm':1,'keywords':tags_list},modify_all=False,record_format='json')
    db_name = "category_tag"
    res = gp.Select(db_name,pattern={'col':['category'],'val':[category]},ret_col=['keywords'])
    ret = json.loads(res)
    ret = json.loads(ret['data'])
    rid = ret['recs'][0]['rid']
    keyword_list = ret['recs'][0]['rec']['keywords'].split(',')
    if len(keyword_list[0]) == 0:
        keyword_list = list()
    keyword_set = set(keyword_list)
    
    keyword_set |= tags_set
    keyword = ','.join(keyword_set)
    keywords = {"keywords":keyword}
    res = gp.Update(db=db_name,rid=rid,new_record=keywords,modify_all=False,record_format='json')
    print(res)
submit('政治',['北韓','社運人士'],'8e7a42ae-16a4-11ea-ba07-2c4d54c22a5f')