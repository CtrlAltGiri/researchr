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

    useEffect(() => {
        newLoader()
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
    
    function newLoader() {
        axios.get('/api/student/projects', {
            params: {
                allProjects: !collegeView
            }
        })
        .then(res => {
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

    let items = []
    projects.forEach((item) => {
        if(filterProjects(item) === true)
            items.push(<Projectile key={item.name} allItems={item} />);
    });

    return (
        apiError === false ? 
        <section className="text-gray-700 body-font">
            
            <div className="flex flex-col w-full justify-end space-y-4">
                <Filters setFilter={setNewFilter} />
                <Toggle text="College View" onClick={() => setCollegeView(!collegeView)}/>
            </div>

            <div className="container px-5 py-0 md:py-8 mx-auto">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={newLoader}
                    hasMore={hasMore}
                    loader={<h1 key="LoadingScreen">Loading....</h1>}
                    element={'div'}
                    className="flex flex-row flex-wrap"
                >
                    {items}
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