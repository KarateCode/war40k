/* eslint-disable no-unused-expressions */
/* eslint-env mocha */
const chai = require('chai');
const expect = chai.expect;

const {slotPoints} = require('../../lib/slot-helper')

describe('A test for App', () => {
	const modelsById = {
		7: {
			name: 'Fire Warrior',
			points: 10,
			second_points: 25,
			third_points: 50,
		},
		8: {
			name: 'Breacher Team',
			points: 10,
			second_points: 25,
			third_points: 50,
		},
	}

	it('should always return the base points if index zero', () => {
		const slot = {
			models: [
				{index: 0, model_id: 7},
			],
		}
		const results = slotPoints(slot, modelsById, 0)
		expect(results).to.equal(10)
	})

	it('should second_points', () => {
		const slot = {
			models: [
				{index: 0, model_id: 7},
				{index: 1, model_id: 7},
			],
		}
		const results = slotPoints(slot, modelsById, 1)
		expect(results).to.equal(25)
	})

	it('should not use second_points if a different modelType', () => {
		const slot = {
			models: [
				{index: 0, model_id: 8},
				{index: 1, model_id: 7},
			],
		}
		const results = slotPoints(slot, modelsById, 1)
		expect(results).to.equal(10)
	})

	it('should use third_points', () => {
		const slot = {
			models: [
				{index: 0, model_id: 7},
				{index: 1, model_id: 7},
				{index: 2, model_id: 7},
			],
		}
		const results = slotPoints(slot, modelsById, 2)
		expect(results).to.equal(50)
	})

	it('should use max out at third_points even if there are more than 3', () => {
		const slot = {
			models: [
				{index: 0, model_id: 7},
				{index: 1, model_id: 7},
				{index: 2, model_id: 7},
				{index: 3, model_id: 7},
				{index: 4, model_id: 7},
			],
		}
		const results = slotPoints(slot, modelsById, 4)
		expect(results).to.equal(50)
	})
})
