from typing import List, Set

def calc_score(num_interest_match, num_exp_match, w1=0.7, w2=0.3):
    """
    Function to calculate recommender score of a project based on interest and exp. match
    :param num_interest_match: Number of interest tags that matched
    :param num_exp_match: Number of exp. tags that matched
    :param w1: Weight of score to be assigned to interest match
    :param w2: Weight of score to be assigned to exp. match
    :return: score
    """
    return (w1*num_interest_match)+(w2*num_exp_match)


def recommend(projects: List, interest_tags: Set, work_exp_tags: Set):
    """
    Function to sort projects based on recommendation algorithm
    :param projects: List of all projects
    :param interest_tags: Set of user interest tags
    :param work_exp_tags: Set of user exp. tags
    :return: Sorted list of projects, num. of projects returned
    """
    # calc scores of all projects
    scored_projects = list(
        map(lambda x: (x, calc_score(len(set(x['tags']) & interest_tags), len(set(x['tags']) & work_exp_tags))),
            projects))
    # sort first based on score and then views
    recommended_projects = [i[0] for i in sorted(scored_projects, key=lambda x: (x[1], x[0]['views']), reverse=True)]
    return recommended_projects, len(recommended_projects)

