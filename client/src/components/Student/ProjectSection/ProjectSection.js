import React, { useState, useEffect } from 'react';
import Projectile from "./Projectile/Projectile";
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios'
import { Error } from '../../General/Form/FormComponents';
import Toggle from '../../General/Form/Toggle';
import Filters from './Projectile/Filters';

function ProjectSection() {

    const [projects, setProjects] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [apiError, setApiError] = useState(false);
    const [collegeView, setCollegeView] = useState(false);
    const [filters, setFilters] = useState({});
    const [oppositeView, setOppositeView] = useState([]);

    useEffect(() => {
        newLoader(0)
        return () => {
            setProjects([]);
        }
    }, [collegeView])

    function setNewFilter(newVal, name){
        setFilters({...filters, [name]: newVal});
    }

    function filterProjects(item){
        if(filters.dept && filters.dept.length > 1){
            if(item.department !== filters.dept){
                return false;
            }
        }
        return true;
    }
    
    function newLoader(pageNo){

        if(pageNo !== 0 || (pageNo === 0 && oppositeView.length === 0)){
            axios.get('/api/student/projects', {
                params: {
                    allProjects: !collegeView
                }
            })
            .then(res => {

                // TEMPORARY SOLUTION.
                if(pageNo === 0)
                    setOppositeView(projects);
                
                // CHANGE THIS TOO EVENTUALLY.
                if(collegeView){
                    setProjects(res.data);
                }
                else{
                    setProjects(res.data);
                    //setProjects([...projects, ...res.data]);
                }
                setHasMore(false);
                setApiError(false);
            })
            .catch(err => setApiError(err.response.data));
        }
        else{
            let temp = projects;
            setProjects(oppositeView);
            setOppositeView(temp);
        }
    }

    return (
        apiError === false ? 
        <section className="text-gray-700 body-font">
            
            <div className="flex flex-row w-full items-center justify-center px-5">
                <Filters setFilter={setNewFilter} />
                <Toggle text="My College View" onClick={() => setCollegeView(!collegeView)}/>
            </div>

            <div className="container px-5 mx-auto">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={newLoader}
                    hasMore={hasMore}
                    initialLoad={false}
                    loader={<h1 key="LoadingScreen">Loading....</h1>}
                    element={'div'}
                    className="flex flex-row flex-wrap"
                >
                    {projects.map(item => {
                        return filterProjects(item) && <Projectile key={item.name} allItems={item} />  
                    })}
                </InfiniteScroll>
            </div>
        </section>
        :
        <div className="flex justify-center">
            <Error text={apiError} />
        </div>
    );
}

export default ProjectSection;