import gaipy as gp
import json
def delete(text_id):
    db_name = "doc_tag"
    res = gp.ExactSearch(db_name,col='text_id',pattern=str(text_id),mode='json')
    ret = json.loads(res)
    ret = json.loads(ret['data'])
    rid = ret['recs'][0]['rid']
    if(len(ret['recs'])>1):
        print('more than one rid')
        return {"Failed","Primary Key more than one"}
    # res = gp.Del(db_name,[rid])
    res = gp.Update(db=db_name,rid=rid,new_record={'confirm':0},modify_all=False,record_format='json')
    return res
    
#print(delete('cb981edc-16c1-11ea-ba07-2c4d54c22a5f'))