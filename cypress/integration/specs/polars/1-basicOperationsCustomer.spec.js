/// <reference types="Cypress" />

import LandingPage from '../../../support/pageObjects/landingPage';
import keyring from '@polkadot/ui-keyring';
import promisify from 'cypress-promise';
import Web3 from 'web3';
import 'cypress-metamask'

const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const landingPage = new LandingPage();

Cypress.on('uncaught:exception', (err, runnable) => {
	return false;
});

describe('Smoke tests', function() {

	let whitePriceIndex = 0;
	let blackPriceIndex = 1;

	let balances = [];
	let tradeBalances = [];
	let baseBalances = [];

	beforeEach(function() {
		cy.clearLocalStorage()
		cy.clearCookies()
	});

	before(function() {
		cy.clearCookies()
		cy.setupMetamask('isolate, powder, section, symbol, feed, snake, obey, detect, spare, meadow, elite, immense', 'rinkeby', 'Thunder23!');
	})

	it('Trade - Liquid pool to White', function() {

		let receiveQuantity = [];

		cy.visit(Cypress.env('url'));

		landingPage.connectWallet();
		landingPage.waitForSuccessMessage();
		landingPage.changeNetwork('Competition');
		landingPage.selectTab('TRADE');
		landingPage.selectLiquidPool();
		cy.contains('USDP')

		landingPage.inputQuantity(100);

		landingPage.getEventPrice(whitePriceIndex).then(async function($el) {
			let whitePrice = $el.text().replace('\n        ', '').replace('\n      ', '');
			return whitePrice;
		}).then(function(result) {
			landingPage.checkPrice().then(async function($el) {
				let checkPrice = await $el.text().split('USDP')[0].toString().replace('\n    ', '').replace(' ', '');
				await expect(result).contains(checkPrice);
			})
		})

		landingPage.checkReceiveQuantity().then(async function($el) {
			let test = await $el.text().toString().split(' WHITE')[0].replace('\n          ','');
			await cy.log(`MESSAGE-${receiveQuantity}`)
			let testUpdate = +test
			receiveQuantity = [testUpdate, '']
			return receiveQuantity;
		})

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = $el.text();
			let secondValue = value.split(': ')[1];
			let balance = +secondValue;
			let nextBalance = (balance + receiveQuantity[0]).toString();

			cy.log('BALANCE:', secondValue);
			cy.log('NEXT:', nextBalance);
			balances = [secondValue, nextBalance];
			return balances;
		})

		landingPage.clickSwapBtn();
		cy.confirmMetamaskTransaction();
		landingPage.clickViewOnEtherscan();
		cy.switchToCypressWindow()

		landingPage.waitForSuccessTransaction();
		landingPage.closeTransactionModal();

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = await $el.text();
			let nextBalance = await value.toString().replace('\n      balance: ', '').replace('\n   ', '').slice(0, -2);
			cy.log(nextBalance);
			expect(balances[1]).contains(nextBalance);
		})
	});

	it('Trade - Liquid pool to Black', function() {

		let receiveQuantity = [];

		cy.visit(Cypress.env('url'));

		landingPage.connectWallet();
		landingPage.waitForSuccessMessage();
		landingPage.changeNetwork('Competition');

		landingPage.selectTab('TRADE');
		landingPage.selectLiquidPool();

		landingPage.changeTokenInModal('BLACK')
		cy.contains('USDP')
		landingPage.inputQuantity(100);

		landingPage.getEventPrice(blackPriceIndex).then(async function($el) {
			let blackPrice = $el.text().replace('\n        ','').replace('\n      ','');
			return blackPrice;
		}).then( function(result) {
			landingPage.checkPrice().then(async function($el) {
				let checkPrice = await $el.text().split('USDP')[0].toString().replace('\n    ','').replace(' ','');
				await expect(result).contains(checkPrice);
			})
		})

		landingPage.checkReceiveQuantity().then(async function($el) {
			let test = await $el.text().toString().split(' BLACK')[0].replace('\n          ','');
			await cy.log(`MESSAGE-${receiveQuantity}`)
			let testUpdate = +test
			receiveQuantity = [testUpdate, '']
			return receiveQuantity;
		})

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = $el.text();
			let secondValue = value.split(': ')[1];
			let balance = +secondValue;
			let nextBalance = (balance + receiveQuantity[0]).toString();

			cy.log('BALANCE:',secondValue);
			cy.log('NEXT:',nextBalance);
			balances = [secondValue, nextBalance];
			return balances;
		})

		landingPage.clickSwapBtn();
		cy.confirmMetamaskTransaction();
		landingPage.clickViewOnEtherscan();
		cy.switchToCypressWindow()

		landingPage.waitForSuccessTransaction();
		landingPage.closeTransactionModal();

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = await $el.text();
			let nextBalance = await value.toString().replace('\n      balance: ','').replace('\n   ','').slice(0,-2);
			cy.log(nextBalance);
			expect(balances[1]).contains(nextBalance);
		})
	});

	it('Trade - Trade pool Black to White', function() {

		let receiveQuantity = [];

		cy.visit(Cypress.env('url'));
		landingPage.connectWallet();
		landingPage.waitForSuccessMessage();

		landingPage.changeNetwork('Competition');

		landingPage.selectTab('TRADE');
		cy.contains('USDP')
		landingPage.selectTradePool();

		cy.wait(1000);
		landingPage.inputQuantity(100);
		landingPage.waitValuesLoaded('WHITE');

		landingPage.checkReceiveQuantity().then(async function($el) {
			let test = await $el.text().toString().split(' WHITE')[0].replace('\n          ','');
			await cy.log(`MESSAGE-${receiveQuantity}`)
			let testUpdate = +test
			receiveQuantity = [testUpdate, '']
			return receiveQuantity;
		})

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = $el.text();
			let secondValue = value.split(': ')[1];
			let balance = +secondValue;
			let nextBalance = (balance + receiveQuantity[0]).toString();

			cy.log('BALANCE:',secondValue);
			cy.log('NEXT:',nextBalance);
			tradeBalances = [secondValue, nextBalance];
			return tradeBalances;
		})

		landingPage.clickSwapBtn();
		landingPage.clickAcceptIfNeeded();

		cy.wait(1000);
		landingPage.clickConfirmSwapBtn();
		cy.wait(1000);
		cy.confirmMetamaskTransaction();
		landingPage.clickViewOnEtherscan();
		cy.switchToCypressWindow()

		landingPage.waitForSuccessTransaction();
		landingPage.closeTransactionModal();

	});

	it('Trade - Trade pool White to Black', function() {

		let receiveQuantity = [];

		cy.visit(Cypress.env('url'));
		landingPage.connectWallet();
		landingPage.waitForSuccessMessage();

		landingPage.changeNetwork('Competition');

		landingPage.selectTab('TRADE');
		cy.contains('USDP')
		landingPage.selectTradePool();
		cy.wait(1000);
		landingPage.changeTokenInModal('BLACK')
		cy.wait(1000);
		landingPage.inputQuantity(100);
		landingPage.waitValuesLoaded('BLACK');

		landingPage.checkReceiveQuantity().then(async function($el) {
			let test = await $el.text().toString().split(' WHITE')[0].replace('\n          ','');
			await cy.log(`MESSAGE-${receiveQuantity}`)
			let testUpdate = +test
			receiveQuantity = [testUpdate, '']
			return receiveQuantity;
		})

		cy.wait(2000);
		landingPage.clickSwapBtn();

		landingPage.clickAcceptIfNeeded();

		landingPage.clickConfirmSwapBtn();
		cy.wait(1000);
		cy.confirmMetamaskTransaction();
		landingPage.clickViewOnEtherscan();
		cy.switchToCypressWindow()

		landingPage.waitForSuccessTransaction();
		landingPage.closeTransactionModal();
	});

	it('Earn - Base pool - Take', function() {

		let bwtPrice = '1';
		cy.visit(Cypress.env('url'));

		landingPage.connectWallet();
		landingPage.waitForSuccessMessage();

		landingPage.changeNetwork('Competition');

		landingPage.selectTab('EARN');

		cy.wait(1000);
		landingPage.inputQuantity(100);

		landingPage.checkPrice().then(async function($el) {
			let checkPrice = await $el.text().split('BWT')[0].toString().replace('\n    ', '').replace(' ', '');
			await expect(bwtPrice).to.eq(checkPrice);
		})

		landingPage.checkReceiveQuantity().then(function($el) {
			let receiveQuantity = $el.text();
			expect(receiveQuantity).contains('100')
		})

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = $el.text();
			let secondValue = value.split(': ')[1];
			let balance = +secondValue;
			let nextBalance = (balance + 100).toString();

			cy.log('BALANCE:', secondValue);
			cy.log('NEXT:', nextBalance);
			balances = [secondValue, nextBalance];
			return baseBalances;
		})

		landingPage.clickTakeBtn('Take Black & White');
		cy.wait(1000);
		cy.confirmMetamaskTransaction();
		landingPage.clickViewOnEtherscan();
		cy.switchToCypressWindow()

		landingPage.waitForSuccessTransaction();
		landingPage.closeTransactionModal();

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = await $el.text();
			let nextBalance = await value.toString().replace('\n      balance: ', '').replace('\n   ', '');
			cy.log(nextBalance);
			expect(nextBalance).contains(balances[1]);
		})
	});

	it('Earn - Base pool - Return', function() {

		let bwtPrice = '1';
		cy.visit(Cypress.env('url'));
		landingPage.connectWallet();
		landingPage.waitForSuccessMessage();

		landingPage.changeNetwork('Competition');

		landingPage.selectTab('EARN');
		landingPage.selectTakeReturn('RETURN LIQUIDITY');

		cy.wait(1000);
		landingPage.inputQuantity(100);

		landingPage.checkPrice().then(async function($el) {
			let checkPrice = await $el.text().split('BWT')[0].toString().replace('\n    ', '').replace(' ', '');
			await expect(bwtPrice).to.eq(checkPrice);
		})

		landingPage.checkReceiveQuantity().then(function($el) {
			let receiveQuantity = $el.text();
			expect(receiveQuantity).contains('100')
		})

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = $el.text();
			let secondValue = value.split(': ')[1];
			let balance = +secondValue;
			let nextBalance = (balance + 100).toString();

			cy.log('BALANCE:', secondValue);
			cy.log('NEXT:', nextBalance);
			balances = [secondValue, nextBalance];
			return baseBalances;
		})

		landingPage.clickTakeBtn('Return Black & White');
		cy.wait(1000);
		cy.confirmMetamaskTransaction();
		landingPage.clickViewOnEtherscan();
		cy.switchToCypressWindow()

		landingPage.waitForSuccessTransaction();
		landingPage.closeTransactionModal();

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = await $el.text();
			let nextBalance = await value.toString().replace('\n      balance: ', '').replace('\n   ', '');
			cy.log(nextBalance);
			expect(nextBalance).contains(balances[1]);
		})
	});

	it('Earn - Liquid pool - Take', function() {

		let bwtPrice = '1';
		cy.visit(Cypress.env('url'));
		landingPage.connectWallet();
		landingPage.waitForSuccessMessage();

		landingPage.changeNetwork('Competition');

		landingPage.selectTab('EARN');
		landingPage.selectEarnPool('LIQUID POOL');

		cy.wait(1000);
		landingPage.inputQuantity(100);

		landingPage.checkPrice().then(async function($el) {
			let checkPrice = await $el.text().split('BWT')[0].toString().replace('\n    ', '').replace(' ', '');
			await expect(bwtPrice).to.eq(checkPrice);
		})

		landingPage.checkReceiveQuantity().then(function($el) {
			let receiveQuantity = $el.text();
			expect(receiveQuantity).contains('100')
		})

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = $el.text();
			let secondValue = value.split(': ')[1];
			let balance = +secondValue;
			let nextBalance = (balance + 100).toString();

			cy.log('BALANCE:', secondValue);
			cy.log('NEXT:', nextBalance);
			balances = [secondValue, nextBalance];
			return baseBalances;
		})

		landingPage.clickTakeBtn('Add Black & White');
		cy.wait(1000);
		cy.confirmMetamaskTransaction();
		landingPage.clickViewOnEtherscan();
		cy.switchToCypressWindow()

		landingPage.waitForSuccessTransaction();
		landingPage.closeTransactionModal();
	});

	it('Earn - Liquid pool - Return', function() {

		let bwtPrice = '1';
		cy.visit(Cypress.env('url'));
		landingPage.connectWallet();
		landingPage.waitForSuccessMessage();

		landingPage.changeNetwork('Competition');

		landingPage.selectTab('EARN');
		landingPage.selectEarnPool('LIQUID POOL');
		cy.wait(1000);
		landingPage.selectTakeReturn('REMOVE LIQUIDITY');

		cy.wait(1000);
		landingPage.inputQuantity(100);

		landingPage.checkPrice().then(async function($el) {
			let checkPrice = await $el.text().split('BWT')[0].toString().replace('\n    ', '').replace(' ', '');
			await expect(bwtPrice).to.eq(checkPrice);
		})

		landingPage.checkReceiveQuantity().then(function($el) {
			let receiveQuantity = $el.text();
			expect(receiveQuantity).contains('100')
		})

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = $el.text();
			let secondValue = value.split(': ')[1];
			let balance = +secondValue;
			let nextBalance = (balance + 100).toString();

			cy.log('BALANCE:', secondValue);
			cy.log('NEXT:', nextBalance);
			balances = [secondValue, nextBalance];
			return baseBalances;
		})

		landingPage.clickTakeBtn('Remove Black & White');
		cy.wait(1000);
		cy.confirmMetamaskTransaction();
		landingPage.clickViewOnEtherscan();
		cy.switchToCypressWindow()

		landingPage.waitForSuccessTransaction();
		landingPage.closeTransactionModal();

		landingPage.getSecondTokenBalance().then(async function($el) {
			let value = await $el.text();
			let nextBalance = await value.toString().replace('\n      balance: ', '').replace('\n   ', '');
			cy.log(nextBalance);
			expect(nextBalance).contains(balances[1]);
		})
	});

	it('Earn - Trade pool - Take', function() {

		let receiveQuantity = [];

		cy.visit(Cypress.env('url'));
		landingPage.connectWallet();
		landingPage.waitForSuccessMessage();

		landingPage.changeNetwork('Competition');

		landingPage.selectTab('EARN');
		landingPage.selectEarnPool('TRADE POOL');

		cy.wait(1000);
		landingPage.inputQuantity(100);
		cy.reload();
		cy.wait(1000);
		landingPage.inputQuantity(100);

		landingPage.checkReceiveQuantity().then(async function($el) {
			let test = await $el.text().toString().split(' PTPT')[0].replace('\n          ','');
			await cy.log(`MESSAGE-${receiveQuantity}`)
			let testUpdate = +test
			receiveQuantity = [testUpdate, '']
			return receiveQuantity;
		})

		landingPage.clickTakeBtn('ADD LIQUIDITY');
		cy.wait(1000);
		cy.confirmMetamaskTransaction();
		landingPage.clickViewOnEtherscan();
		cy.switchToCypressWindow()

		landingPage.waitForSuccessTransaction();
		landingPage.closeTransactionModal();
	});

	it('Earn - Trade pool - Return', function() {

		let receiveQuantity = [];

		cy.visit(Cypress.env('url'));
		landingPage.connectWallet();
		landingPage.waitForSuccessMessage();

		landingPage.changeNetwork('Competition');

		landingPage.selectTab('EARN');
		landingPage.selectEarnPool('TRADE POOL');
		cy.wait(1000);
		landingPage.selectTakeReturn('REMOVE LIQUIDITY');

		cy.wait(1000);
		landingPage.inputQuantity(10);

		landingPage.checkReceiveQuantity().then(async function($el) {
			let test = await $el.text().toString().split(' PTPT')[0].replace('\n          ','');
			await cy.log(`MESSAGE-${receiveQuantity}`)
			let testUpdate = +test
			receiveQuantity = [testUpdate, '']
			return receiveQuantity;
		})

		landingPage.clickTakeBtn('REMOVE LIQUIDITY');
		cy.wait(1000);

		cy.confirmMetamaskTransaction();
		landingPage.clickViewOnEtherscan();
		cy.switchToCypressWindow()

		landingPage.waitForSuccessTransaction();
		landingPage.closeTransactionModal();
	});

});


