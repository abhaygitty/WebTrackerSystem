import React from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import MuiTreeList from './treelists/muitreeList';

const TreeComponent =
  ({listItems,
    listItemIsEnabled,
    expandedListItems,
    activeListItem,
    handleTouchTap,
    handleTouchTapInSearchMode,
    handleSearch,
    searchTerm }) => (
        <Drawer
          open={true}
          width={300}>
          <AppBar
            style={{ marginTop: 10 }}
            title={<Link to="/"><FlatButton label="Web Tracker" /></Link>}
            iconElementLeft={<Link to="/">
              <IconButton>
                <ActionHome />
              </IconButton>
            </Link>}
          />
          <MuiTreeList
            listItems={listItems}
            contentKey={'title'}
            useFolderIcons={true}
            haveSearchbar={true}
            listItemIsEnabled={listItemIsEnabled}
            expandedListItems={expandedListItems}
            activeListItem={activeListItem}
            handleTouchTap={handleTouchTap}
            handleTouchTapInSearchMode={handleTouchTapInSearchMode}
            handleSearch={handleSearch}
            searchTerm={searchTerm}
          >
            <Subheader>Version 1.0.0</Subheader>
          </MuiTreeList>
        </Drawer>
  );

/*
 <TreeList
 listItems={listItems}
 contentKey={'title'}
 useFolderIcons={true}
 haveSearchbar={true}
 listItemIsEnabled={listItemIsEnabled}
 expandedListItems={expandedListItems}
 activeListItem={activeListItem}
 handleTouchTap={handleTouchTap}
 handleTouchTapInSearchMode={handleTouchTapInSearchMode}
 handleSearch={handleSearch}
 searchTerm={searchTerm}
 icons={icons}
 >
 </TreeList>
 */
TreeComponent.propTypes = {
  listItems: PropTypes.array.isRequired,
  listItemIsEnabled: PropTypes.array,
  expandedListItems: PropTypes.array,
  activeListItem: PropTypes.number,
  handleTouchTap: PropTypes.func,
  handleTouchTapInSearchMode: PropTypes.func,
  handleSearch: PropTypes.func,
  searchTerm: PropTypes.string
};

export default TreeComponent;
