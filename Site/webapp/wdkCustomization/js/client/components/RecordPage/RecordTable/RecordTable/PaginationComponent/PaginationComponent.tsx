import React from 'react'
import { ComponentProps } from 'react-table';
import * as PT from './types';

const defaultButton = (props: any) => (
  <button type="button" {...props} className="-btn">
    {props.children}
  </button>
)

export default class ReactTablePagination extends React.Component<PT.PaginationProps, PT.PaginationState> {
  private rowMin: number;
  private rowMax: number;
  private rowCount: number;

  static defaultProps = {
    PreviousComponent: defaultButton,
    NextComponent: defaultButton,
    renderPageJump: ({
      onChange, value, onBlur, onKeyPress, inputType, pageJumpText,
    }: PT.RenderPageJumpProps) => (
        <div className="-pageJump">
          <input
            aria-label={pageJumpText}
            type={inputType}
            onChange={onChange}
            value={value}
            onBlur={onBlur}
            onKeyPress={onKeyPress}
          />
        </div>
      ),
    renderCurrentPage: (page: number) => <span className="-currentPage">{page + 1}</span>,
    renderTotalPagesCount: (pages: number) => <span className="-totalPages">{pages || 1}</span>,
    renderPageSizeOptions: ({
      pageSize,
      pageSizeOptions,
      rowsSelectorText,
      onPageSizeChange,
      rowsText,
    }: PT.RenderPageSizeProps) => (
        <span className="select-wrap -pageSizeOptions">
          <select
            aria-label={rowsSelectorText}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            value={pageSize}
          >
            {pageSizeOptions.map((option, i) => (
              <option key={i} value={option}>
                {`${option} ${rowsText}`}
              </option>
            ))}
          </select>
        </span>
      ),
  }

  constructor(props: any) {
    super(props)

    this.getSafePage = this.getSafePage.bind(this)
    this.changePage = this.changePage.bind(this)
    this.applyPage = this.applyPage.bind(this)

    this.state = {
      page: props.page,
    }

    this.updateCurrentRows(props)
  }

  componentWillReceiveProps(nextProps: PT.PaginationProps) {
    if (this.props.page !== nextProps.page) {
      this.setState({ page: nextProps.page })
    }
    this.updateCurrentRows(nextProps);
  }

  getSafePage(page: number) {
    console.log(page);
    if (Number.isNaN(page)) {
      page = this.props.page
    }
    return Math.min(Math.max(page, 0), this.props.pages - 1)
  }

  changePage(page: number) {
    page = this.getSafePage(page)
    this.setState({ page })
    if (this.props.page !== page) {
      this.props.onPageChange(page)
    }
  }

  applyPage(e?: React.ChangeEvent) {
    if (e) {
      e.preventDefault()
    }
    const page = this.state.page;
    this.changePage(page === '' ? this.props.page : page);
  }

  updateCurrentRows(props: PT.PaginationProps) {
    if (typeof props.sortedData !== 'undefined'
      && typeof props.page !== 'undefined'
      && typeof props.pageSize !== 'undefined'
    ) {
      this.rowCount = props.sortedData.length
      this.rowMin = props.page * props.pageSize + 1
      this.rowMax = Math.min((props.page + 1) * props.pageSize, this.rowCount)
    }
  }

  getPageJumpProperties() {
    return {
      onKeyPress: (e: React.KeyboardEvent) => {
        if (e.which === 13 || e.keyCode === 13) {
          this.applyPage();
        }
      },
      onBlur: this.applyPage,
      value: this.state.page === '' ? '' : this.state.page + 1,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const val: any = e.target.value;
        const page = val - 1;
        if (val === '') {
          return this.setState({ page: val });
        }
        this.setState({ page: this.getSafePage(page) })
      },
      inputType: this.state.page === '' ? 'text' : 'number',
      pageJumpText: this.props.pageJumpText,
    }
  }

  render() {
    const {
      // Computed
      pages,
      // Props
      page,
      showPageSizeOptions,
      pageSizeOptions,
      pageSize,
      showPageJump,
      canPrevious,
      canNext,
      onPageSizeChange,
      className,
      PreviousComponent,
      NextComponent,
      renderPageJump,
      renderCurrentPage,
      renderTotalPagesCount,
      renderPageSizeOptions,
      sortedData,
    } = this.props

    return (
      //webpack is getting confused here, need to dig deeper once build settles down
      //@ts-ignore
      <div className={`${className} -pagination`} style={this.props.style}>
        <div className="-previous">
          <PreviousComponent
            onClick={() => {
              if (!canPrevious) return
              this.changePage(page - 1)
            }}
            disabled={!canPrevious}
          >
            {this.props.previousText}
          </PreviousComponent>
        </div>
        <div className="-center">
          <span className="-pageInfo">
            {this.props.pageText}{' '}
            {showPageJump ? renderPageJump(this.getPageJumpProperties()) : renderCurrentPage(page)}{' '}
            {this.props.ofText} {renderTotalPagesCount(pages)}
          </span>
          {(typeof this.rowCount !== 'undefined') ?
            <span className="-rowInfo">{"Showing "}
              <span className="-rowMin">{this.rowMin}</span>
              {" - "}
              <span className="-rowMax">{this.rowMax}</span>
              {" of "}
              <span className="-rowCount">{this.rowCount}</span>
              {" total records"}
            </span>
            : ''
          }
          {showPageSizeOptions &&
            renderPageSizeOptions({
              pageSize,
              rowsSelectorText: this.props.rowsSelectorText,
              pageSizeOptions,
              onPageSizeChange,
              rowsText: this.props.rowsText,
            })}
        </div>
        <div className="-next">
          <NextComponent
            onClick={() => {
              if (!canNext) return
              this.changePage(page + 1)
            }}
            disabled={!canNext}
          >
            {this.props.nextText}
          </NextComponent>
        </div>
      </div>
    )
  }
}

