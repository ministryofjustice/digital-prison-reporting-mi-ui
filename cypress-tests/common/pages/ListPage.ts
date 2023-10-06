import Page, { PageElement } from './page'
import { components } from '../../../server/types/api'

export default class ListPage extends Page {
  variantDefinition: components['schemas']['VariantDefinition']

  constructor(variantDefinition: components['schemas']['VariantDefinition']) {
    super(variantDefinition.name)

    this.variantDefinition = variantDefinition
  }

  showFilterButton = (): PageElement => cy.get(`.filter-summary-show-filter-button`)

  clearAllButton = (): PageElement => cy.get(`.moj-button-menu__wrapper .govuk-button--primary`)

  pagingLink = (): PageElement => cy.get('.govuk-pagination__link').first()

  pageSizeSelector = (): PageElement => cy.get('#pageSize')

  filterPanel = (): PageElement => cy.get('.moj-filter')

  filter = (id): PageElement => cy.get(`#filters\\.${id}`)

  dataTable = (): PageElement => cy.get('table')

  applyFiltersButton = (): PageElement => cy.get(`[data-apply-form-to-querystring='true']`)

  selectedFilterButton = (): PageElement => cy.get('.filter-summary-remove-button')

  unsortedSortColumnLink = (): PageElement => this.dataTable().find(`a[aria-sort='none']`).first()

  currentSortColumnLink = (): PageElement => this.dataTable().find(`a[aria-sort!='none']`).first()
}