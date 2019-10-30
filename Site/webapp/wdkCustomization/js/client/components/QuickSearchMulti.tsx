import React, { Component } from 'react';
import { Mesa } from 'wdk-client/Components';


//TODO: connect to store

interface QuickSearchMulti  {
  webappUrl: string;
  showTooltip: boolean;
  className ?: string;
}

interface Question  { parameter: string, questionFullName: string }

interface qsState  {
  question: Question;
  searchText: string;
}

const INITIAL_STATE: qsState = {
  question: {
    parameter: 'value(generic_gene_identifier)',
    questionFullName: 'GeneQuestions.gene_id',
  },
  searchText: ''
}

let questionList: { regex: RegExp, question: Question }[] = [
  {
    regex: /rs\d+/i,
    question: {
      parameter: 'value(generic_variant_identifier)',
      questionFullName: 'VariantQuestions.variant_id'
    }
  },
  {
    regex: /([([XYM]|[0-9]{1,2})(:\d+)(:[A|a|C|c|G|g|T|t]+)(:[A|a|C|c|G|g|T|t]+)/,
    question: {
      parameter: 'value(generic_variant_identifier)',
      questionFullName: 'VariantQuestions.variant_id'
    }
  }
]

const toolTipConfig = {
  style: { boxSizing: 'border-box' },
  renderHtml: true,
  content: "e.g., APOE, rs6656401, 19:45411941:T:C"
}

const QuickSearchMulti: React.ComponentClass<QuickSearchMulti, qsState> = class extends React.Component<QuickSearchMulti, qsState>  {

  private questionList = questionList;
  private formGroup: React.ComponentType;

  constructor(props: QuickSearchMulti) {
    super(props);
    this.state = INITIAL_STATE;
  }

  private _resolveQuestion = (input: React.FormEvent<HTMLInputElement>) => {
    const match = this.questionList.find(item => item.regex.test(input.currentTarget.value));
    //todo: use callback in setState
    if (match) this.setState({
      question: match.question
    })
  }

  render() {
    const { webappUrl } = this.props;

    return (
      <form
        className={"search-multi-form " + this.props.className}
        name="questionForm"
        method="post"
        action={webappUrl + '/processQuestionSetsFlat.do'}
      >{this.props.showTooltip ?
        <Mesa.AnchoredTooltip {...toolTipConfig} >
          <QuickSearchMultiFormGroup
            questionFullName={this.state.question.questionFullName}
            questionParameter={this.state.question.parameter}
            onInputChange={this._resolveQuestion}
          />
        </Mesa.AnchoredTooltip> :
        <QuickSearchMultiFormGroup
          questionFullName={this.state.question.questionFullName}
          questionParameter={this.state.question.parameter}
          onInputChange={this._resolveQuestion}
        />
        }
      </form>)
  }
}

interface QuickSearchMultiFormGroup  {
  questionFullName: string;
  questionParameter: string;
  onInputChange: { (evant: any): void }
}

const QuickSearchMultiFormGroup: React.SFC<QuickSearchMultiFormGroup> = (props: QuickSearchMultiFormGroup) => {
  return <div className="form-group">
    <input type="hidden" name="questionFullName" value={props.questionFullName} />
    <input type="hidden" name="questionSubmit" value="Get Answer" />
    <div className="input-group">
      <div className="input-group-prepend">
        <button className="input-group-text" type="submit" ><i className="fa fa-search"></i></button>
      </div>
      <input
        placeholder="enter a gene or variant"
        type="text"
        className="form-control quick-search-multi-box"
        name={props.questionParameter}
        onChange={props.onInputChange}
      />
    </div>
  </div>;
}

interface ToolTipProps  {
  hideDelay?: number
  children?: React.ReactNode,
  className?: string,
  content?: React.ReactNode,
  corner?: string,
  fadeOut?: boolean,
  position?: object,
  getPosition?: { (): object }
}

export default QuickSearchMulti;