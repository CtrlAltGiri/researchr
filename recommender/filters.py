from datetime import datetime
from typing import Dict

from dateutil.relativedelta import relativedelta


def make_filters(data: Dict) -> Dict:
    """
    Function to make filters in query when querying the mongodb collection for profProjects
    :param data: The request body that contains the filters if any
    :return: Query with filters
    """
    query = {}
    # start month filter
    if 'start_month' in data['filters']:
        # filter only the projects that have start date within 1 month or 2 months
        if data['filters']['start_month'] in [1,2]:
            cur_date = datetime.today()
            end_date = cur_date + relativedelta(months=data['filters']['start_month'])
            query.update({'startDate': {'$gte': cur_date, '$lt': end_date}})

    # location filter
    if 'work_from_home' in data['filters']:
        # if work from home is true
        if data['filters']['work_from_home']:
            loc_filter = {'$eq': "WFH"}
        else:
            loc_filter = {'$ne': "WFH"}
        query.update({'location': loc_filter})

    return query
