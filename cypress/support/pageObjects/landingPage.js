// import ApiService from './api_service';
import Web3 from 'web3';

class LandingPage {

	constructor() {
		this.btnConnectWallet = '.menu .menu__button';

		this.btnSelectWallet = '.wallets .wallet-layout';

		this.btnClick = '//button';

		this.successMessage = "//p[contains(.,'Successfully connected to Metamask')]";

		this.successTransaction = "//p[contains(.,'Successfull transaction')]";

		this.mainTab = 'a';

		this.tradePoll = "a[href='/trade/trade']";

		this.liquidPoll = "a[href='/trade/liquid']";

		this.networkComponent = '.menu__actions .switch-platform p';

		this.colleteral = 'div.chose-colleteral';

		this.eventPrice = '.event.active .team';

		this.tokenInfo = '.card .card__content .token-wrapper';

		this.tokenInput = '.card__content .token-wrapper .token__content input';

		this.tokenMaxBtn = '.card__content .token-wrapper .token__content .token__max';

		this.tokenShape = '.card__content .token-wrapper .token__content .token__shape';

		this.swapTokensFromTo = '.card__content .card-buttons';

		this.checkPriceTxt = '.card .card__content .check-price div';

		this.recieveQuantity = '.list .list__title .list__item div';

		this.viewOnEtherscanBtn = "a[href*='https://rinkeby.etherscan']";
	}

	connectWallet() {
		cy.get(this.btnConnectWallet).click();
		cy.get(this.btnSelectWallet)
			.eq(0)
			.click();
	}

	clickOnBtn(text) {
		cy.xpath(this.btnClick).contains(text).click();
	}

	waitForSuccessMessage() {
		return cy.xpath(this.successMessage, {timeout:60000})
			.should('exist')
			.should('be.visible')
	}

	waitForSuccessTransaction() {
		return cy.xpath(this.successTransaction, {timeout:60000})
			.should('exist')
			.should('be.visible')
	}

	selectTab(tab) {
		cy.get(this.mainTab).contains(tab).click();
	}

	testNetwork () {
		let test = cy.get(this.networkComponent);
			return test;
	}

	changeNetwork(network) {
		this.testNetwork().then(function($el) {
			let value = $el.text();
			cy.log(value);
			if (value == network) {
				cy.log('SELECTED');
			} else {
				cy.get('.menu__actions .switch-platform p').click();
				cy.get('div.chose-colleteral').contains(network).click();
			}
		})
	}

	selectTradePool() {
		cy.get(this.tradePoll).click();
	}

	selectLiquidPool() {
		cy.get(this.liquidPoll).click();
	}

	selectTradePool() {
		cy.get(this.tradePoll).click();
	}

	getEventPrice(index) {
		return cy.get(this.eventPrice)
			.eq(index)
	}

	clickSwap(btn) {
		cy.get('.card div').contains(btn)
	}

	inputQuantity(value) {
		cy.wait(2000);
		cy.get(this.tokenInput)
			.eq(0)
			.click()
			.type(value, {delay:200})
	}

	checkPrice() {
		return cy.get(this.checkPriceTxt)
	}

	checkReceiveQuantity() {
		cy.wait(1000);
		return cy.get(this.recieveQuantity)
			.eq(1)
	}

	clickSwapBtn(){
		cy.wait(1000);
		cy.get('.card div').contains('SWAP').click();
	}

	clickTakeBtn(content){
		cy.get('.card div').contains(content).click();
	}

	acceptIfNeeded() {
		cy.get('div').contains('Accept').click();
	}

	clickConfirmSwapBtn(){
		cy.get('.confirmation__button div').click();
	}

	clickViewOnEtherscan() {
		cy.get(this.viewOnEtherscanBtn).click();
	}

	activityTab(){
		cy.get('button').contains('Activity').click();
	}

	selectUnconfirmedTransaction() {
		cy.get('.transaction-list-item--unconfirmed').click();
	}

	successTransactionScan() {
		return cy.get('.card-body span[data-toggle="tooltip"]').contains('Success');
	}

	checkFromQuantityToken(quantity, token) {
		cy.xpath(`(//*[@id='wrapperContent']//*[@class='media-body'])[1][contains(.,'${quantity}') and contains(.,'${token}')]`)
	}

	checkToQuantityToken(quantity, token) {
		cy.xpath(`(//*[@id='wrapperContent']//*[@class='media-body'])[2][contains(.,'${quantity}') and contains(.,'${token}')]`)
	}

	getTransactionId() {
		return cy.get('.card-body #spanTxHash');
	}

	closeTransactionModal() {
		cy.get('div').contains('Close').click();
	}

	getSecondTokenBalance() {
		return cy.get(`.token [class*='token__balance']`).eq(1);
	}

	changeTokenInModal(token) {
		cy.get(this.tokenShape)
			.eq(1)
			.click();
		cy.wait(2000);
		cy.get('.modal-layout .token').contains(token).click();
	}

	selectTakeReturn(option) {
		cy.get('.action-selector div').contains(option).click();
	}

	selectEarnPool(pool) {
		cy.get('.nav a').contains(pool).click();
	}

	clickAcceptIfNeeded(){
		cy.get('body').then(($a) => {
			if ($a.text().includes('Accept')) {
				cy.contains('Accept')
					.click({force:true})
			} else {
				cy.log('!')
			}
		})
	}

	waitValuesLoaded(token) {
		return cy.xpath(`//*[@class='list__title']//div[contains(@class,'list__value') and contains(.,'0 ${token}')]`)
			.should('not.exist');
	}

}
export default LandingPage;