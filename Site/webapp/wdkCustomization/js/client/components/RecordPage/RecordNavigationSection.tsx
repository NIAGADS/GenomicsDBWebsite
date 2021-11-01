//@ts-nocheck
import { includes, memoize, throttle } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import CategoriesCheckboxTree from 'wdk-client/Components/CheckboxTree/CategoriesCheckboxTree';
import { getId, getTargetType, isIndividual } from 'wdk-client/Utils/CategoryUtils';
import { Seq } from 'wdk-client/Utils/IterableUtils';
import { preorderSeq, pruneDescendantNodes } from 'wdk-client/Utils/TreeUtils';
import RecordNavigationItem from 'wdk-client/Views/Records/RecordNavigation/RecordNavigationItem';
import { constant } from 'wdk-client/Utils/Json';

/** Navigation panel for record page */

const RecordNavigationSection: React.FC<any> = ({}) => {
  return <h1>HERE!!!</h1>
}

export default RecordNavigationSection;

/*
export default class RecordNavigationSection extends React.PureComponent {

  constructor(props) {
    super(props);
    this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
    this.setActiveCategory = throttle(this.setActiveCategory.bind(this), 300);
    this.state = { activeCategory: null };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.setActiveCategory, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.setActiveCategory, { passive: true });
  }

  componentDidUpdate(previousProps) {
    if (this.props.collapsedSections !== previousProps.collapsedSections ||
        this.props.showChildren !== previousProps.showChildren ) {
      this.setActiveCategory();
    }
  }

  setActiveCategory() {
    let { categoryTree, navigationCategoriesExpanded } = this.props;
    let activeCategory = Seq.from(removeFields(categoryTree).children)
      // transform each top-level node into a list of all nodes of that branch
      // of the tree that are visible in this section
      .flatMap(topLevelNode => [
        topLevelNode,
        ...preorderSeq(topLevelNode)
          .filter(node => navigationCategoriesExpanded.includes(getId(node)))
          .flatMap(node => node.children)
      ])
      // find the category whose content is near the top of the viewport
      .findLast(node => {
        let id = getId(node);
        let domNode = document.getElementById(id);
        if (domNode == null) return;
        let rect = domNode.getBoundingClientRect();
        return rect.top <= 10;
      });

    this.setState({ activeCategory });
  }

  handleSearchTermChange(term) {
    this.props.onNavigationQueryChange(term);
  }

  render() {
    let {
      categoryTree,
      collapsedSections,
      heading,
      navigationQuery,
      navigationCategoriesExpanded,
      onNavigationCategoryExpansionChange,
      onSectionToggle
    } = this.props;

    return (
      <div className="wdk-RecordNavigationSection">
         <h1>WORKS!!!!</h1>
        <h2 className="wdk-RecordNavigationSectionHeader">
          <span dangerouslySetInnerHTML={{__html: heading}}/>
        </h2>
       
        <CategoriesCheckboxTree
          disableHelp
          visibilityFilter={isNotAttribute}
          searchBoxPlaceholder="Search section names..."
          tree={categoryTree}
          leafType="section"
          isSelectable={false}
          expandedBranches={navigationCategoriesExpanded}
          onUiChange={onNavigationCategoryExpansionChange}
          searchTerm={navigationQuery}
          onSearchTermChange={this.handleSearchTermChange}
          renderNode={(node, path) =>
            <RecordNavigationItem
              node={node}
              path={path}
              onSectionToggle={onSectionToggle}
              activeCategory={this.state.activeCategory}
              checked={!includes(collapsedSections, getId(node))}
            />
          }
        />
      </div>
    );
  }
} */

RecordNavigationSection.propTypes = {
  collapsedSections: PropTypes.array,
  onSectionToggle: PropTypes.func,
  heading: PropTypes.node
};

RecordNavigationSection.defaultProps = {
  onSectionToggle: function noop() {},
  heading: 'Contents'
};



const removeFields = memoize(root =>
  pruneDescendantNodes(node => !isIndividual(node), root));

function isNotAttribute(node) {
  return getTargetType(node) !== 'attribute';
}
