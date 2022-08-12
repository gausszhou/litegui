import LiteGUI from ".";
/**
 * Split
 * @class Split
 * @constructor
 */

function Split(sections, options, legacy) {
	options = options || {};

	if (sections && sections.constructor === String) {
		let id = sections;
		sections = options;
		options = legacy || {};
		options.id = id;
		console.warn("LiteGUI.Split legacy parameter, use sections as first parameter instead of id.");
	}

	const root = document.createElement("div");
	this.root = root;

	if (options.id) {
		root.id = options.id;
	}
	root.className = "litesplit " + (options.vertical ? "vsplit" : "hsplit");
	this.sections = [];

	for (let i in sections) {
		var section = document.createElement("div");

		section.className = "split-section split" + i;
		if (typeof sections[i] == "number") {
			if (options.vertical) section.style.height = sections[i].toFixed(1) + "%";
			else section.style.width = sections[i].toFixed(1) + "%";
		} else if (typeof sections[i] == "string") {
			if (options.vertical) section.style.height = sections[i];
			else section.style.width = sections[i];
		} else {
			if (sections[i].id) section.id = sections[i].id;
			if (options.vertical)
				section.style.height =
					typeof sections[i].height == "Number" ? sections[i].height.toFixed(1) + "%" : sections[i].height;
			else
				section.style.width =
					typeof sections[i].width == "Number" ? sections[i].width.toFixed(1) + "%" : sections[i].width;
		}

		section.add = function (element) {
			this.appendChild(element.root || element);
		};

		this.sections.push(section);
		root.appendChild(section);
	}

	if (options.parent) {
		if (options.parent.root) options.parent.root.appendChild(root);
		else options.parent.appendChild(root);
	}
}
Split.prototype.getSection = function (n) {
	return this.sections[n];
};
// LiteGUI.Split = Split;

export default Split;
