import React, { Component } from 'react';
import TreeComponent from '../components/Tree';
import {listItems} from '../components/treelists/data';

const files = listItems
  .map((listItem, i) => {
    if (!listItem.children) {
      return i;
    } else {
      return null;
    }
  })
  .filter(function(listItemIndex) {
    // console.log('!!listItemIndex', !!listItemIndex);
    return !!listItemIndex; });

function getAllParents(listItem, listItems, parents=[]) {
  if (listItem.parentIndex) {
    return getAllParents(listItems[listItem.parentIndex], listItems, parents.concat([listItem.parentIndex]));
  } else {
    return parents;
  }
}

class TreeSidebar extends Component {
  constructor(props) {
    super(props);

    const firstFile = files[0];
    const listItemIsEnabled = listItems.map((listItem, i) => {
      if (i >= 12) {
        return false;
      } else {
        return true;
      }
    });

    this.state = {
      expandedListItems: [],
      activeListItem: firstFile,
      listItemIsEnabled,
      listItems,
      searchTerm: ''
    };
    this.collapseAll = this.collapseAll.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleTouchTapInSearchMode = this.handleTouchTapInSearchMode.bind(this);
  }

  componentDidUpdate(preProps, prevState) {
    const {activeListItem, listItems} = this.state;
    if (activeListItem !== prevState.activeListItem) {
      const expandedListItems = getAllParents(listItems[activeListItem], listItems);
      this.setState({
        expandedListItems: expandedListItems
      });
    }
  }

  collapseAll() {
    this.setState({expandedListItems: []});
  }

  handleSearch(searchTerm) {
    this.setState({searchTerm});
  }

  handleTouchTap(listItem, index) {
    // console.log('trigger handleTouchTap in container');
    if (listItem.children) {
      const indexOfListItemInArray = this.state.expandedListItems.indexOf(index);
      // console.log('indexOfListItemInArray', indexOfListItemInArray);
      if (indexOfListItemInArray === -1) {
        this.setState({
          expandedListItems: this.state.expandedListItems.concat([index])
        });
      } else {
        let newArray = [].concat(this.state.expandedListItems);
        newArray.splice(indexOfListItemInArray, 1);
        this.setState({
          expandedListItems: newArray
        });
      }
    } else {
      this.setState({
        activeListItem: index
      });
    }
  }

  handleTouchTapInSearchMode(listItem, index) {
    // console.log('trigger handleTouchTapInSearchMode in container');
    if (!listItem.children) {
      const expandedListItems = getAllParents(listItem, listItems);
      // console.log('expandedListItems in handleTouchTapInSearchMode', expandedListItems);
      this.setState({
        activeListItem: index,
        expandedListItems,
        searchTerm: ''
      });
    }
  }

  /*
   componentDidMount() {
   const xhr = new XMLHttpRequest();
   xhr.open('get', '/api/dashboard');
   xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
   // set the authorization HTTP header
   xhr.setRequestHeader('Authorization', `${Auth.getToken()}`);
   xhr.responseType = 'json';
   console.log('Auth.getToken()', Auth.getToken());
   xhr.addEventListener('load', () => {
   if (xhr.status === 200) {
   console.log('xhr.reponse.message', xhr.response.message);
   this.setState({
   secretdata: xhr.response.message
   });
   }
   });
   xhr.send();
   }
   render() {
   return (<Dashboard secretData={this.state.secretdata} />);
   }
   */


  render() {
    const {listItems, listItemIsEnabled, expandedListItems, activeListItem, searchTerm} = this.state;
    // console.log('listItems[activeListItem] of render() in dashboardpage', listItems[activeListItem]);
    return (
        <TreeComponent
          listItems={listItems}
          listItemIsEnabled={listItemIsEnabled}  // Deprecated by listItems.disabled
          expandedListItems={expandedListItems}
          activeListItem={activeListItem}
          searchTerm={searchTerm}
          handleTouchTap={this.handleTouchTap}
          handleTouchTapInSearchMode={this.handleTouchTapInSearchMode}
          handleSearch={this.handleSearch}
        />
    );
  }
}
export default TreeSidebar;
