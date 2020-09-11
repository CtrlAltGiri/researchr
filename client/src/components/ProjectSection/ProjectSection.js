import React, {Component} from 'react';
import Projectile from "./Projectile/ProjectileTest";
import InfiniteScroll from 'react-infinite-scroller';

class ProjectSection extends Component{

    constructor(props){
        super(props)
        this.state = {
          projects: [],
          hasMore: true
        };
    }
    
    newLoader() {
        fetch('/api/projects', {mode: 'cors'})
            .then(res => res.json())
            .then(newProjects => this.setState((state, props) => ({projects: this.state.projects.concat(newProjects.projects)})))
            .catch(err => console.log(err));
    }


    render(){
        var items = []
        this.state.projects.map((item) => {
            items.push(<Projectile allItems={item} />);
        });

        return(
            <section className="text-gray-700 body-font overflow-hidden">
                <div className="container px-5 py-0 md:py-8 mx-auto">
                <InfiniteScroll
                    pageStart={0}
                    loadMore={this.newLoader.bind(this)}
                    hasMore={this.state.hasMore}
                    loader={<h1>Loading....</h1>}
                    element={'div'}
                    className="flex flex-row flex-wrap"
                >
                        {items}
                </InfiniteScroll>
                </div>
            </section>
        );
    }
}

export default ProjectSection;