const CaseCategory = require('../models/CaseCategory');
const Case = require('../models/Case');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs/promises');
const crypto = require('crypto');

exports.getCategories = async (req, res, next) => {
	try {
		const categories = await CaseCategory.find({});
		res.status(200).json({ data: categories });
	} catch (error) {
		next(error);
	}
};

exports.getCategory = async (req, res, next) => {
	try {
		const id = req.params.id;
		const cat = await CaseCategory.findById(id);
		res.status(200).json({ data: cat });
	} catch (error) {
		next(error);
	}
};

exports.addCategory = async (req, res, next) => {
	try {
		const body = req.body;

		const name = body.name;

		const cat = await new CaseCategory({ name });

		await cat.save((err) => {
			if (err)
				return next(new ErrorResponse('Could not create case category', 500));
		});

		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.updateCategory = async (req, res, next) => {
	try {
		const body = req.body;
		const id = req.params.id;
		const name = body.name;

		const cat = await CaseCategory.findById(id);

		cat.name = name;

		await cat.save((err) => {
			if (err)
				return next(
					new ErrorResponse('Could not create contactscreen assets', 500)
				);
		});

		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.deleteCategory = async (req, res, next) => {
	try {
		const id = req.params.id;
		const cat = await CaseCategory.findById(id);
		const cases = await Case.find({ category_id: id });
		cases.map(async (c) => {
			await handleDeleteCase(c, next);
		});
		await CaseCategory.deleteOne({ _id: cat._id });
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.getCases = async (req, res, next) => {
	try {
		const id = req.params.id;
		let cases = [];
		if (id && id !== '-1') {
			cases = await Case.find({ category_id: id });
		}
		if (id && id === '-1') {
			cases = await Case.find({});
		}

		res.status(200).json({ data: cases });
	} catch (error) {
		next(error);
	}
};

exports.getCase = async (req, res, next) => {
	try {
		const id = req.params.id;
		const caseInd = await Case.findById(id);
		res.status(200).json({ data: caseInd });
	} catch (error) {
		next(error);
	}
};

exports.addCase = async (req, res, next) => {
	try {
		const body = req.body;
		const category_id = req.params.id;
		const files = req.files;

		console.log(category_id);
		console.log(files);

		const title = JSON.parse(body.title);
		const subtitle = JSON.parse(body.subtitle);
		const textBlocks = JSON.parse(body.textBlocks);
		const blocksKeyInfo = JSON.parse(body.blocksKeyInfo);
		const description = JSON.parse(body.description);

		const caseInstance = await new Case({
			mobileWidth: body.mobileWidth,
			title: title,
			subtitle: subtitle,
			category_id: category_id,
			description: description,
		});

		if (files && files.preview) {
			const previewName = await fileUpload(
				files.preview,
				undefined,
				undefined,
				next,
				`case_preview_${caseInstance._id}`,
				'/files/uploads/cases/preview/'
			);
			caseInstance.preview = previewName;
		}

		let blocks = [];
		if (blocksKeyInfo && blocksKeyInfo.length > 0) {
			await blocksKeyInfo.map(async (blockKey, bindex) => {
				const { type, index: fieldIndex } = blockKey;
				let field;
				if (type === 'img') {
					const key = blockKey.key;
					if (files && files[key]) {
						const file = files[key];
						const uploadPath = '/files/uploads/cases/imgs/';
						const imgName = await fileUpload(
							file,
							undefined,
							undefined,
							next,
							`case_img_${caseInstance._id}_${key}`,
							uploadPath
						);
						field = {
							type: type,
							img: imgName,
						};
					}
				} else if (type === 'uploadedVideo') {
					const key = blockKey.key;
					if (files && files[key]) {
						const file = files[key];
						const uploadPath = '/files/uploads/cases/imgs/';
						const vidName = await fileUpload(
							file,
							undefined,
							undefined,
							next,
							`case_vid_${caseInstance._id}_${key}`,
							uploadPath
						);
						field = {
							type: type,
							src: vidName,
						};
					}
				} else if (type === 'gallery') {
					const keys = blockKey.keys;
					let gallery = [];
					if (keys && keys.length > 0) {
						await keys.map(async (key, kindex) => {
							if (files && files[key]) {
								const file = files[key];
								const uploadPath = '/files/uploads/cases/gallery/';
								const imgName = await fileUpload(
									file,
									undefined,
									undefined,
									next,
									`case_gallery_${caseInstance._id}_${key}`,
									uploadPath
								);
								gallery.push(imgName);
							}
							return key;
						});
					}
					field = { type: type, gallery: gallery };
				} else {
					const key = blockKey.key;
					field = textBlocks[key];
				}
				blocks[bindex] = field;
			});
		}
		caseInstance.blocks = blocks;
		await caseInstance.save((err) => {
			if (err) {
				return next(new ErrorResponse('Could not create product', 500));
			}
		});
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.updateCase = async (req, res, next) => {
	try {
		const body = req.body;
		const case_id = req.params.id;
		const files = req.files;

		const title = JSON.parse(body.title);
		const subtitle = JSON.parse(body.subtitle);
		const textBlocks = JSON.parse(body.textBlocks);
		const blocksKeyInfo = JSON.parse(body.blocksKeyInfo);
		const description = JSON.parse(body.description);

		const caseInstance = await Case.findById(case_id);

		caseInstance.mobileWidth = body.mobileWidth;
		caseInstance.title = title;
		caseInstance.subtitle = subtitle;
		caseInstance.description = description;

		if (files && files.preview) {
			const previewName = await fileUpload(
				files.preview,
				caseInstance.preview,
				undefined,
				next,
				`case_preview_${caseInstance._id}`,
				'/files/uploads/cases/preview/'
			);
			caseInstance.preview = previewName;
		}

		let blocks = [];
		let oldBlockImgs = [];
		let oldBlockVids = [];
		let oldBlockGalleryImgs = [];
		const oldBlocks = caseInstance.blocks;
		await oldBlocks.map(async (ob, obindex) => {
			if (ob.type === 'img') {
				oldBlockImgs.push(ob.img);
			}
			if (ob.type === 'uploadedVideo') {
				oldBlockVids.push(ob.src);
			}
			if (ob.type === 'gallery') {
				const gallery = ob.gallery;
				if (gallery && gallery.length > 0) {
					await gallery.map((g) => {
						oldBlockGalleryImgs.push(g);
					});
				}
			}
		});

		if (blocksKeyInfo && blocksKeyInfo.length > 0) {
			await blocksKeyInfo.map(async (blockKey, bindex) => {
				const { type, index: fieldIndex } = blockKey;
				let field;
				if (type === 'img') {
					const key = blockKey.key;
					if (files && files[key]) {
						const file = files[key];
						const uploadPath = '/files/uploads/cases/imgs/';
						const imgName = await fileUpload(
							file,
							undefined,
							undefined,
							next,
							`case_img_${caseInstance._id}_${key}`,
							uploadPath
						);
						field = {
							type: type,
							img: imgName,
						};
					} else {
						field = {
							type: type,
							img: blockKey.oldKey,
						};
					}
				} else if (type === 'uploadedVideo') {
					const key = blockKey.key;
					if (files && files[key]) {
						const file = files[key];
						const uploadPath = '/files/uploads/cases/imgs/';
						const vidName = await fileUpload(
							file,
							undefined,
							undefined,
							next,
							`case_vid_${caseInstance._id}_${key}`,
							uploadPath
						);
						field = {
							type: type,
							src: vidName,
						};
					} else {
						field = {
							type: type,
							src: blockKey.oldKey,
						};
					}
				} else if (type === 'gallery') {
					const keys = blockKey.keys;
					const oldKeys = blockKey.updatedOldKeys;
					let gallery = [];
					if (keys && keys.length > 0) {
						await keys.map(async (key, kindex) => {
							if (files && files[key]) {
								const file = files[key];
								const uploadPath = '/files/uploads/cases/gallery/';
								const imgName = await fileUpload(
									file,
									undefined,
									undefined,
									next,
									`case_gallery_${caseInstance._id}_${key}`,
									uploadPath
								);
								gallery.push(imgName);
							}
							return key;
						});
					}
					field = { type: type, gallery: [...oldKeys, ...gallery] };
				} else {
					const key = blockKey.key;
					field = textBlocks[key];
				}
				blocks[bindex] = field;
			});
		}
		caseInstance.blocks = blocks;

		let updatedBlockImgs = [];
		let updatedBlockVids = [];
		let updatedBlockGalleryImgs = [];

		const newBlocks = caseInstance.blocks;

		await newBlocks.map(async (nb, nbindex) => {
			if (nb.type === 'img') {
				updatedBlockImgs.push(nb.img);
			}
			if (nb.type === 'uploadedVideo') {
				updatedBlockVids.push(nb.src);
			}
			if (nb.type === 'gallery') {
				const gallery = nb.gallery;
				if (gallery && gallery.length > 0) {
					await gallery.map((g) => {
						updatedBlockGalleryImgs.push(g);
					});
				}
			}
		});

		const extraBlocksImgsToDelete = oldBlockImgs.filter(
			(og) => !updatedBlockImgs.includes(og)
		);
		const extraBlocksGalleryImgsToDelete = oldBlockGalleryImgs.filter(
			(og) => !updatedBlockGalleryImgs.includes(og)
		);
		const extraBlockVidsToDelete = oldBlockVids.filter(
			(ov) => !updatedBlockVids.includes(ov)
		);

		await caseInstance.save(async (err) => {
			if (err) {
				console.log(err);
				return next(new ErrorResponse('Could not create case', 500));
			}
			if (extraBlocksImgsToDelete && extraBlocksImgsToDelete.length > 0) {
				extraBlocksImgsToDelete.map(async (img) => {
					try {
						if (
							await ifFileExists(`${__clientdir}${img.replace(`${__uploadRoot}`, '')}`)
						) {
							fs.unlink(`${__clientdir}${img.replace(`${__uploadRoot}`, '')}`);
						}
					} catch (error) {
						return next(new ErrorResponse('internal error', 500));
					}
				});
			}
			if (extraBlockVidsToDelete && extraBlockVidsToDelete.length > 0) {
				extraBlockVidsToDelete.map(async (vid) => {
					try {
						if (
							await ifFileExists(`${__clientdir}${vid.replace(`${__uploadRoot}`, '')}`)
						) {
							fs.unlink(`${__clientdir}${vid.replace(`${__uploadRoot}`, '')}`);
						}
					} catch (error) {
						return next(new ErrorResponse('internal error', 500));
					}
				});
			}
			if (
				extraBlocksGalleryImgsToDelete &&
				extraBlocksGalleryImgsToDelete.length > 0
			) {
				extraBlocksGalleryImgsToDelete.map(async (img) => {
					try {
						if (
							await ifFileExists(`${__clientdir}${img.replace(`${__uploadRoot}`, '')}`)
						) {
							fs.unlink(`${__clientdir}${img.replace(`${__uploadRoot}`, '')}`);
						}
					} catch (error) {
						return next(new ErrorResponse('internal error', 500));
					}
				});
			}
		});
		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

exports.deleteCase = async (req, res, next) => {
	try {
		const id = req.params.id;
		const caseInstance = await Case.findById(id);

		await handleDeleteCase(caseInstance, next);

		res.status(200).json({ status: 'success' });
	} catch (error) {
		next(error);
	}
};

const fileUpload = async (
	file,
	currentFile,
	defaultFile,
	next,
	mainName,
	movePath
) => {
	const new_img = file;
	const old_img = currentFile;
	if (old_img !== defaultFile) {
		try {
			if (
				await ifFileExists(
					`${__clientdir}${old_img.replace(`${__uploadRoot}`, '')}`
				)
			) {
				fs.unlink(`${__clientdir}${old_img.replace(`${__uploadRoot}`, '')}`);
			}
		} catch (error) {
			return next(new ErrorResponse('internal error', 500));
		}
	}
	let ext = new_img.name.split('.');
	ext = ext[ext.length - 1];
	const file_name = `${crypto
		.randomBytes(10)
		.toString('hex')}-${mainName}-${new Date().getTime().toString()}.${ext}`;
	new_img.mv(`${__clientdir}${movePath}${file_name}`, (err) => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(err, 500));
		}
	});

	return `${__uploadRoot}${movePath}${file_name}`;
};

const ifFileExists = async (path) => {
	try {
		await fs.access(path);
		return true;
	} catch (error) {
		return false;
	}
};

const handleDeleteCase = async (caseInstance, next) => {
	const preview = caseInstance.preview;
	try {
		if (
			await ifFileExists(`${__clientdir}${preview.replace(`${__uploadRoot}`, '')}`)
		) {
			fs.unlink(`${__clientdir}${preview.replace(`${__uploadRoot}`, '')}`);
		}
	} catch (error) {
		return next(new ErrorResponse('internal error', 500));
	}

	const blocks = caseInstance.blocks;
	if (blocks && blocks.length > 0) {
		await blocks.map(async (b) => {
			if (b.type === 'img') {
				const img = b.img;
				try {
					if (
						await ifFileExists(`${__clientdir}${img.replace(`${__uploadRoot}`, '')}`)
					) {
						fs.unlink(`${__clientdir}${img.replace(`${__uploadRoot}`, '')}`);
					}
				} catch (error) {
					return next(new ErrorResponse('internal error', 500));
				}
			}
			if (b.type === 'uploadedVideo') {
				const vid = b.src;
				try {
					if (
						await ifFileExists(`${__clientdir}${vid.replace(`${__uploadRoot}`, '')}`)
					) {
						fs.unlink(`${__clientdir}${vid.replace(`${__uploadRoot}`, '')}`);
					}
				} catch (error) {
					return next(new ErrorResponse('internal error', 500));
				}
			}
			if (b.type === 'gallery') {
				const gallery = b.gallery;
				if (gallery && gallery.length > 0) {
					await gallery.map(async (g) => {
						try {
							if (
								await ifFileExists(`${__clientdir}${g.replace(`${__uploadRoot}`, '')}`)
							) {
								fs.unlink(`${__clientdir}${g.replace(`${__uploadRoot}`, '')}`);
							}
						} catch (error) {
							return next(new ErrorResponse('internal error', 500));
						}
					});
				}
			}
		});
	}
	await Case.deleteOne({ _id: caseInstance._id });
};
