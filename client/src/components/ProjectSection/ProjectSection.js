import React, { useState } from 'react';
import Projectile from "./Projectile/Projectile";
import InfiniteScroll from 'react-infinite-scroller';
import axios from 'axios'

function ProjectSection() {

    const [projects, setProjects] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    function newLoader() {
        axios.get('/api/projects')
        .then(res => {
            setHasMore(false);
            setProjects([...projects, ...res.data]);
        })
        .catch(err => console.log(err));
    }

    let items = []
    projects.map((item) => {
        items.push(<Projectile key={item.name} allItems={item} />);
    });
    return (
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
    );
}

export default ProjectSection;