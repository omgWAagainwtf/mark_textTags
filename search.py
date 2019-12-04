import gaipy as gp
import json
import math
def search(cur_category,cur_page):
    db_name = "doc_tag"
    res = gp.Select(db=db_name,pattern={'col':['category'],'val':[cur_category]},filter_args={'col':["confirm"],"val":["0"]},page=cur_page,page_cnt=10)
    ret = json.loads(res)
    ret = json.loads(ret['data'])
    document = []
    keywords = []
    category = []
    text_id = []
    for i in range(len(ret['recs'])):
        document.append(ret['recs'][i]['rec']['content'])
        keywords.append(ret['recs'][i]['rec']['keywords'].split(','))
        category.append(ret['recs'][i]['rec']['category'])
        text_id.append(ret['recs'][i]['rec']['text_id'])

    total_page = math.ceil(ret['cnt']/10)
    return {"text":document,"tag":keywords,"text_id":text_id,"category":category,"pages":total_page}
# print(search('政治',1))