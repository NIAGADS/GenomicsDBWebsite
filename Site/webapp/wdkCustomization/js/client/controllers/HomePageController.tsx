import React from 'react';
import { PageController } from 'wdk-client/Controllers';
import HomePage from '../components/HomePage2/HomePage';

export default class HomePageController extends PageController {

  getTitle() {
    return 'NIAGADS|GenomicsDB';
  }

  renderView = () => <HomePage />

}