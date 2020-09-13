import React, { useState } from 'react';
import Projectile from "./Projectile/Projectile";
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios'
import {Error} from '../../General/Form/FormComponents';

function ProjectSection() {

    const [projects, setProjects] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [apiError, setApiError] = useState(false);

    function newLoader() {
        axios.get('/api/projects')
        .then(res => {
            setHasMore(false);
            setProjects([...projects, ...res.data]);
            setApiError(false);
        })
        .catch(err => setApiError(err.response.data));
    }

    let items = []
    projects.map((item) => {
        items.push(<Projectile key={item.name} allItems={item} />);
    });
    return (
        apiError === false ? 
        <section className="text-gray-700 body-font overflow-hidden">
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