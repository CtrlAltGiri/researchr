import React, { Component } from 'react';
import './App.css';
import Projectile from '../Projectile/Projectile';
import InfiniteScroll from 'react-infinite-scroller';


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      projects: [],
      hasMore: true
    };
  }

  componentDidMount() {
    fetch('/passwords', {mode: 'cors'})
      .then(res => res.json())
      .then(projects => this.setState({ projects: projects }));
  }

  newLoader() {
    fetch('/passwords', {mode: 'cors'})
      .then(res => res.json())
      .then(newProjects => this.setState((state, props) => ({projects: this.state.projects.concat(newProjects)})))
  }

  render() {

  var items = []
  this.state.projects.map((item) => {
      items.push(<Projectile name={item} />);
  })

    return (
      // <div>
      //   <ul className="flex flex-col items-center">
      //     {
      //       this.state.projects.map((item) => {
      //         return (<Projectile name={item} />);
      //       })
      //     }
      //   </ul>
      // </div>

      <InfiniteScroll
      pageStart={0}
      loadMore={this.newLoader.bind(this)}
      hasMore={this.state.hasMore}
      loader={<h1>Loading....</h1>}>

      <div className="">
          {items}
      </div>
      </InfiniteScroll>
      );
  }
}

export default App;
