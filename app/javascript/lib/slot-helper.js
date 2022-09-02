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

			let modelTypeCount = 0
			for (const i of _.range(index, -1, -1)) {
				const modelId = slot.models[i].model_id
				if (modelName === modelsById[modelId].name) {
					modelTypeCount++
				}
			}
			// once we spec this out, consider moving to lodash ^^

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
