const _ = require('lodash');

const slotHelper = {
    slotPoints(slot, modelsById, index) {
		if (!slot) {return}
		const row = _.find(_.get(slot, 'models'), {index})
		if (!row) {return}

		if (!modelsById) {return}
		const model = modelsById[row.model_id]
        if (!model) {return}
		const modelName = model.name

		// For Tau, return if this is the first, second, or third instance of this being added to a model
		if (index === 0) {
			return _.get(model, 'points')
		} else {

			const modelTypeCount = _.range(index, -1, -1)
				.map((i) => slot.models[i].model_id) // morph indexes to model_id's
				.map((modelId) => modelsById[modelId].name) // morph to modelName's
				.filter((name) => name === modelName)
				.length

			if (modelTypeCount === 1) {
				return _.get(model, 'points')
			} else if (modelTypeCount === 2) {
				return _.get(model, 'second_points') || _.get(model, 'points')
			} else if (modelTypeCount > 2) {
				return _.get(model, 'third_points') || _.get(model, 'second_points') || _.get(model, 'points')
			}
		}
    },
};

module.exports = slotHelper;
