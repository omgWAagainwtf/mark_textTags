import gaipy as gp
import json
def init():
    db_name = "category_tag"
    res = gp.Select(db=db_name,ret_col=['category'])
    ret = json.loads(res)
    ret = json.loads(ret['data'])
    keyword_list = ret['recs'][0]['rec']['category'].split(',')
    return keyword_list
def get_document():
    db_name = "doc_tag"
    res = gp.Select(db=db_name,filter_args={'col':["confirm"],"val":["0"]},page=1,page_cnt=10)
    ret = json.loads(res)
    ret = json.loads(ret['data'])
    document = ret['recs'][0]['rec']['content']
    keywords = ret['recs'][0]['rec']['keywords'].split(',')
    category = ret['recs'][0]['rec']['category']
    text_id = ret['recs'][0]['rec']['text_id']
    confirm = ret['recs'][0]['rec']['confirm']
    return {"text":document,"tag":keywords,"category":category,"text_id":text_id,"confirm":str(confirm)}
# print(get_document())
# print(init())