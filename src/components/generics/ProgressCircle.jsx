/*
	DATA INTERFACE
	{
		predata?: [
			{
				source: [
					{ adicionaIva: false, nombre: 'Consumidor Final' },
					{ adicionaIva: true, nombre: 'Responsable Inscripto' },
					{ adicionaIva: true, nombre: 'Monotributista' },
					{ adicionaIva: false, nombre: 'Excento' }
				],
				service: 'condicionesfiscales',
				title: 'Condiciones fiscales'
			}[]
		],
		data?: [
			{
					source: [
					{
						params: {	// Model params, except those that require previous data
							ciudad: '-',
							cuit: '-',
							direccion: '-',
							documentoReceptor: 86,
							email: '-',
							normalizedBusinessName: normalizeString('Consumidor final'),
							provincia: '-',
							razonSocial: 'Consumidor final',
							telefono: '-',
						},
						predataService: [
							{
								prop: 'condicionFiscal',	// Add to params
								query: { nombre: 'Consumidor Final' },
								service: 'condicionesfiscales'
							}[]
						],
					}
				],
				service: 'clientes',
				title: 'Clientes'
			}[]
		],
		isCompleted: false, // If true, ProgressCircle is disabled
		isCompletedDispatch: home_dispatch,
		isCompletedType: 'SET_IS_ACTIVE_STEP_COMPLETED'
	}
*/

// React components
import React, { useEffect, useState } from 'react'

// Custom components
import InputHidden from './InputHidden'
import { errorAlert } from '../../components/alerts'

// Design components
import { Button, Col, Progress, Row } from 'antd'

// Helpers
import helpers from '../../helpers'

// Services
import api from '../../services'

// Imports destructuring
const { nextInteger } = helpers.mathHelper


const finalizedProcessTitleStyle = { color: 'green', fontWeight: 'bold' }


const ProgressCircle = ({ data }) => {
	const dataIsSaved = data.isCompleted
	const dataSourceLength = data.data.reduce((acc, val) => acc + val.source.length, 0)
	const dataRenderProgressParam = nextInteger(100 / dataSourceLength)
	const dataRenderTitlesParam = nextInteger(100 / data.data.length)

	const predataSourceLength = data.predata.reduce((acc, val) => acc + val.source.length, 0)
	const predataRenderProgressParam = nextInteger(100 / predataSourceLength)
	const predataRenderTitlesParam = nextInteger(100 / data.predata.length)

	// -------------------------------------- Actions ---------------------------------------- //
	const [dataAndPredataAreCompleted, setDataAndPredataAreCompleted] = useState(false)
	const [dataIsCompleted, setDataIsCompleted] = useState(false)
	const [existsData, setExistsData] = useState(false)
	const [existsPredata, setExistsPredata] = useState(false)
	const [predataIsCompleted, setPredataIsCompleted] = useState(false)

	const failAlert = () => {
		errorAlert('Fallo al crear registros nuevos. Intente de nuevo.')
	}

	const reloadPage = () => {
		return window.location.reload()
	}

	const dispatchDataAndPredataAreCompleted = () => {
		if (dataIsSaved) return setDataAndPredataAreCompleted(true)
		const isCompleted = verifyDataAndPredataAreCompleted()
		setDataAndPredataAreCompleted(isCompleted)
		data.isCompletedDispatch({ type: data.isCompletedType, payload: isCompleted })
	}

	const verifyDataAndPredataAreCompleted = () => {
		const status = []
		if (existsData) status.push(dataIsCompleted)
		else status.push(true)
		if (existsPredata) status.push(predataIsCompleted)
		else status.push(true)
		if (status.includes(false)) return false
		else return true
	}

	const verifyExistsDataAndPredata = () => {
		if (data.data) setExistsData(true)
		else setExistsData(false)
		if (data.predata) setExistsPredata(true)
		else setExistsPredata(false)
	}

	useEffect(() => {
		dispatchDataAndPredataAreCompleted()
		// eslint-disable-next-line
	}, [dataIsSaved, existsData, dataIsCompleted, existsPredata, predataIsCompleted])

	useEffect(() => {
		verifyExistsDataAndPredata()
		// eslint-disable-next-line
	}, [data])

	// ------------------------------- Progress of save data --------------------------------- //
	const [saveDataPercent, setSaveDataPercent] = useState(0)
	const [showDataTitles, setShowDataTitles] = useState(false)

	let saveDataAttemps = 0
	const saveDataDelay = ms => new Promise(result => setTimeout(result, ms))

	const saveData = async () => {
		setShowDataTitles(true)

		for (let index = 0; index < data.data.length; index++) {
			const model = data.data[index]
			const modelSource = model.source
			const modelService = model.service

			for (let index = 0; index < modelSource.length; index++) {
				const newRecord = modelSource[index].params

				// Add params that requires pre-data to new record
				const predata = modelSource[index].predataService
				for (let index = 0; index < predata.length; index++) {
					const predataProp = predata[index]
					const res = await api[predataProp.service].findAllByFilters(JSON.stringify(predataProp.query))
					if (res.docs.length === 0) {
						failAlert()
						return reloadPage()
					}
					newRecord[predataProp.prop] = res.docs[0]._id
				}

				const res = await api[modelService].save(newRecord)
				if (res.code !== 200) {
					failAlert()
					return reloadPage()
				}

				saveDataAttemps++
				setSaveDataPercent(saveDataAttemps * dataRenderProgressParam)
				await saveDataDelay(100)
			}
		}

		setDataIsCompleted(true)
		return 'OK'
	}

	const buttonToGenerateData = (
		<Button
			disabled={!predataIsCompleted || dataIsSaved || dataIsCompleted}
			onClick={saveData}
			style={{ width: '100%' }}
			type='primary'
		>
			Generar data
		</Button>
	)

	const progressOfData = (
		<Progress
			type='circle'
			percent={dataAndPredataAreCompleted ? 100 : saveDataPercent}
		/>
	)

	const titlesOfData = data.data.map((dataItem, index) => {
		const percentLimit = (index + 1) * dataRenderTitlesParam
		const ellipsis = (saveDataPercent >= percentLimit || dataAndPredataAreCompleted) ? null : '...'
		const style = (saveDataPercent >= percentLimit || dataAndPredataAreCompleted) ? finalizedProcessTitleStyle : null
		const title = !showDataTitles && !dataAndPredataAreCompleted
			? null
			: (
				<p
					key={'first_steps_dataTitles' + index}
					style={style}
				>
					Generando {dataItem.title} {ellipsis}
				</p>
			)
		return title
	})

	const dataItemsToRender = [
		{
			item: <InputHidden />,
			order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 4, xxl: 2 }
		},
		{
			item: buttonToGenerateData,
			order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
		},
		{
			item: progressOfData,
			order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 2, xxl: 3 }
		},
		{
			item: titlesOfData,
			order: { lg: 4, md: 4, sm: 4, xl: 4, xs: 3, xxl: 4 }
		}
	]

	const dataResponsiveGrid = {
		gutter: { horizontal: 8, vertical: 16 },
		span: { lg: 12, md: 12, sm: 12, xl: 12, xs: 24, xxl: 12 }
	}

	const dataItems = (
		<Row gutter={[dataResponsiveGrid.gutter.horizontal, dataResponsiveGrid.gutter.vertical]}>
			{
				dataItemsToRender.map((itemToRender, index) => {
					return (
						<Col
							key={'progressCircle_data_itemsToRender_' + index}
							lg={{ order: itemToRender.order.lg, span: dataResponsiveGrid.span.lg }}
							md={{ order: itemToRender.order.md, span: dataResponsiveGrid.span.md }}
							sm={{ order: itemToRender.order.sm, span: dataResponsiveGrid.span.sm }}
							xl={{ order: itemToRender.order.xl, span: dataResponsiveGrid.span.xl }}
							xs={{ order: itemToRender.order.xs, span: dataResponsiveGrid.span.xs }}
							xxl={{ order: itemToRender.order.xxl, span: dataResponsiveGrid.span.xxl }}
						>
							{itemToRender.item}
						</Col>
					)
				})
			}
		</Row>
	)

	// ----------------------------- Progress of save pre data ------------------------------- //
	const [savePreDataPercent, setSavePreDataPercent] = useState(0)
	const [showPredataTitles, setShowPredataTitles] = useState(false)

	let savePredataAttemps = 0
	const savePredataDelay = ms => new Promise(result => setTimeout(result, ms))

	const savePredata = async () => {
		setShowPredataTitles(true)

		for (let index = 0; index < data.predata.length; index++) {
			const model = data.predata[index]
			const modelSource = model.source
			const modelService = model.service

			for (let sourceIndex = 0; sourceIndex < modelSource.length; sourceIndex++) {
				const newRecord = modelSource[sourceIndex]
				const res = await api[modelService].save(newRecord)
				if (res.code !== 200) {
					failAlert()
					return reloadPage()
				}

				savePredataAttemps++
				setSavePreDataPercent(savePredataAttemps * predataRenderProgressParam)
				await savePredataDelay(100)
			}
		}

		setPredataIsCompleted(true)
		return 'OK'
	}

	const buttonToGeneratePredata = (
		<Button
			disabled={dataIsSaved || predataIsCompleted}
			onClick={savePredata}
			style={{ width: '100%' }}
			type='primary'
		>
			Generar pre-data
		</Button>
	)

	const progressOfPredata = (
		<Progress
			type='circle'
			percent={dataAndPredataAreCompleted ? 100 : savePreDataPercent}
		/>
	)

	const titlesOfPredata = data.predata.map((preDataItem, index) => {
		const percentLimit = (index + 1) * predataRenderTitlesParam
		const ellipsis = (savePreDataPercent >= percentLimit || dataAndPredataAreCompleted) ? null : '...'
		const style = (savePreDataPercent >= percentLimit || dataAndPredataAreCompleted) ? finalizedProcessTitleStyle : null
		const title = !showPredataTitles && !dataAndPredataAreCompleted
			? null
			: (
				<p
					key={'first_steps_predataTitles' + index}
					style={style}
				>
					Generando {preDataItem.title} {ellipsis}
				</p>
			)
		return title
	})

	const predataItemsToRender = [
		{
			item: <InputHidden />,
			order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 4, xxl: 2 }
		},
		{
			item: buttonToGeneratePredata,
			order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 }
		},
		{
			item: progressOfPredata,
			order: { lg: 3, md: 3, sm: 3, xl: 3, xs: 2, xxl: 3 }
		},
		{
			item: titlesOfPredata,
			order: { lg: 4, md: 4, sm: 4, xl: 4, xs: 3, xxl: 4 }
		}
	]

	const predataResponsiveGrid = {
		gutter: { horizontal: 8, vertical: 16 },
		span: { lg: 12, md: 12, sm: 12, xl: 12, xs: 24, xxl: 12 }
	}

	const predataItems = (
		<Row gutter={[predataResponsiveGrid.gutter.horizontal, predataResponsiveGrid.gutter.vertical]}>
			{
				predataItemsToRender.map((itemToRender, index) => {
					return (
						<Col
							key={'progressCircle_predata_itemsToRender_' + index}
							lg={{ order: itemToRender.order.lg, span: predataResponsiveGrid.span.lg }}
							md={{ order: itemToRender.order.md, span: predataResponsiveGrid.span.md }}
							sm={{ order: itemToRender.order.sm, span: predataResponsiveGrid.span.sm }}
							xl={{ order: itemToRender.order.xl, span: predataResponsiveGrid.span.xl }}
							xs={{ order: itemToRender.order.xs, span: predataResponsiveGrid.span.xs }}
							xxl={{ order: itemToRender.order.xxl, span: predataResponsiveGrid.span.xxl }}
						>
							{itemToRender.item}
						</Col>
					)
				})
			}
		</Row>
	)

	// ---------------------------------- Items to render ------------------------------------ //
	const items = [
		{
			item: dataItems,
			order: { lg: 2, md: 2, sm: 2, xl: 2, xs: 2, xxl: 2 },
			render: existsData
		},
		{
			item: predataItems,
			order: { lg: 1, md: 1, sm: 1, xl: 1, xs: 1, xxl: 1 },
			render: existsPredata
		}
	]

	const generalResponsiveGrid = {
		gutter: { horizontal: 8, vertical: 16 },
		span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
	}


	return (
		<Row gutter={[generalResponsiveGrid.gutter.horizontal, generalResponsiveGrid.gutter.vertical]}>
			{
				items.map((item, index) => {
					return (
						<Col
							key={'progressCircle_predata_itemsToRender_' + index}
							lg={{ order: item.order.lg, span: generalResponsiveGrid.span.lg }}
							md={{ order: item.order.md, span: generalResponsiveGrid.span.md }}
							sm={{ order: item.order.sm, span: generalResponsiveGrid.span.sm }}
							xl={{ order: item.order.xl, span: generalResponsiveGrid.span.xl }}
							xs={{ order: item.order.xs, span: generalResponsiveGrid.span.xs }}
							xxl={{ order: item.order.xxl, span: generalResponsiveGrid.span.xxl }}
						>
							{item.item}
						</Col>
					)
				})
			}
		</Row>
	)
}

export default ProgressCircle