/*
	DATA INTERFACE
	{
		fields: {
			action: 'SET_CUIT',									// Action type of reducer dispatch
			datePickerValue: null,								// Value to antd DatePicker
			dispatch: business_dispatch,						// Reducer dispatch
			label: 'Cuit',										// Placeholder
			parser: cuitParser, 								// () => { return parsed value }
			selectOptionsLabels: null,							// Label to generate select options
			selectOptionsService: null,							// Service to find records for select options
			status: business_state.params.cuit.fieldStatus,		// error || null
			type: 'input', 										// 'input' || 'datePicker' || 'select'
			value: business_state.params.cuit.value				// Value from reducer state
		}[],
		isCompleted: false, 									// If true, Form is disabled
		isCompletedDispatch: home_dispatch,						// Function to dispatch if Form is completed
		isCompletedType: 'SET_IS_ACTIVE_STEP_COMPLETED',		// Action type of dispatch function
		service: 'business'										// Service to save or edit data
	}
*/

// React Components and Hooks
import React, { useState } from 'react'

// Custom Components
import { errorAlert } from '../../components/alerts'

// Design Components
import { Button, Col, DatePicker, Input, Row, Select, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

// Services
import api from '../../services'


const Form = ({ data }) => {

	// -------------------------------------- Actions ---------------------------------------- //
	const reloadPage = () => {
		return window.location.reload()
	}

	const verifyIfExistsValue = (value) => {
		if (!value || value === '') return false
		else return true
	}

	// ---------------------------------- Button to save ------------------------------------- //
	const save = async () => {
		const status = verifyStatus()
		if (!status) return

		const params = {}
		for (let index = 0; index < data.fields.length; index++) {
			const field = data.fields[index]
			params[field.key] = field.value
		}
		let res
		if (data.isCompleted) {
			const findPreviousData = await api[data.service].findAll()
			const previousDataId = findPreviousData.data[0]._id
			const newParams = { _id: previousDataId, ...params }
			res = await api[data.service].edit(newParams)
		} else res = await api[data.service].save(params)

		if (res.status !== 'OK') {
			errorAlert('No se pudo realizar el registro. Intente de nuevo.')
			return reloadPage()
		}
		data.isCompletedDispatch({ type: data.isCompletedType, payload: true })
	}

	const verifyStatus = () => {
		const fieldStatus = []
		const fields = data.fields.filter(field => field.type !== 'uploader')
		for (let index = 0; index < fields.length; index++) {
			const field = fields[index]
			const existsValue = verifyIfExistsValue(field.value)
			const verifyDatePickerValue = field.datePickerValue
				? verifyIfExistsValue(field.datePickerValue)
				: true
			field.dispatch({
				type: field.action,
				payload: { fieldStatus: existsValue && verifyDatePickerValue ? null : 'error' }
			})
			fieldStatus.push(existsValue, verifyDatePickerValue)
		}
		if (fieldStatus.includes(false)) return false
		else return true
	}

	const buttonToSave = (
			<Button
				id='buttonToSave'
				onClick={save}
				style={{ backgroundColor: data.isCompleted ? '#52c41a' : null, width: '100%' }}
				
				type='primary'
			>
				{data.isCompleted ? 'Editar' : 'Generar'}
			</Button>
	)

	// ------------------------------- Generate date picker ---------------------------------- //
	const onChangeDatePicker = (date, dateString, field) => {
		const parsedValue = field.parser ? field.parser(date) : date
		const existsValue = verifyIfExistsValue(parsedValue)
		field.dispatch({
			type: field.action,
			payload: {
				fieldStatus: existsValue ? null : 'error',
				datePickerValue: dateString,
				value: parsedValue
			}
		})
	}

	const generateDatePicker = (field) => {
		const input = (
			<>
				<DatePicker
					format={['DD-MM-YYYY']}
					onChange={(date, dateString) => onChangeDatePicker(date, dateString, field)}
					placeholder={field.label}
					status={field.status === 'error' ? 'error' : null}
					style={{ width: '100%' }}
					value={field.datePickerValue}
				/>
				<span
					style={{
						color: 'red',
						display: field.status === 'error' ? 'block' : 'none'
					}}
				>
					Debes elegir una fecha.
				</span>
			</>
		)
		return input
	}

	// ---------------------------------- Generate input ------------------------------------- //
	const onChangeInput = (e, field) => {
		const parsedValue = field.parser ? field.parser(e.target.value) : e.target.value
		const existsValue = verifyIfExistsValue(parsedValue)
		field.dispatch({
			type: field.action,
			payload: {
				fieldStatus: existsValue ? null : 'error',
				value: parsedValue
			}
		})
	}

	const generateInput = (field) => {
		const input = (
			<>
				<Input
					disabled={field.disabled}
					onChange={e => onChangeInput(e, field)}
					placeholder={field.label}
					status={field.status === 'error' ? 'error' : null}
					style={{ width: '100%' }}
					value={field.value}
				/>
				<span
					style={{
						color: 'red',
						display: field.status === 'error' ? 'block' : 'none'
					}}
				>
					Debes completar este campo.
				</span>
			</>
		)
		return input
	}

	// -------------------------------- Generate selects ------------------------------------- //
	const onClearSelect = (field) => {
		field.dispatch({ type: field.action, payload: { fieldStatus: 'error', value: null } })
	}

	const onSelect = (e, field) => {
		const parsedValue = field.parser ? field.parser(e) : e
		const existsValue = verifyIfExistsValue(parsedValue)
		field.dispatch({
			type: field.action,
			payload: {
				fieldStatus: existsValue ? null : 'error',
				value: parsedValue
			}
		})
	}

	const generateSelect = (field) => {
		const select = (
			<>
				<Select
					allowClear
					onClear={() => onClearSelect(field)}
					onSelect={e => onSelect(e, field)}
					options={field.selectOptions}
					placeholder={field.label}
					status={field.status === 'error' ? 'error' : null}
					style={{ width: '100%' }}
					value={field.value}
				/>
				<span
					style={{
						color: 'red',
						display: field.status === 'error' ? 'block' : 'none'
					}}
				>
					Debes seleccionar una opción.
				</span>
			</>
		)
		return select
	}

	// -------------------------------- Generate uploader ------------------------------------ //
	const [uploadedImages, setUploadedImages] = useState([])

	const uploaderProps = (field) => {
		const props = {
			accept: '.jpg,.jpeg,.png',
			beforeUpload: () => false,
			multiple: false,
			name: 'file',
			onChange: (info) => uploadImageToServer(info.file, field),
			onRemove: () => removeImage(uploadedImages[0]._id, field)
		}
		return props
	}

	const uploadImageToServer = async (file, field) => {
		const res = await api.uploader.uploadImage(file)
		if (res?.code !== 200) {
			return field.dispatch({
				type: field.action,
				payload: {
					fieldStatus: 'error',
					value: null
				}
			})
		}
		setUploadedImages(res.file)
		field.dispatch({
			type: field.action,
			payload: {
				fieldStatus: null,
				value: res.file[0]._id
			}
		})
	}

	const removeImage = async (id, field) => {
		const res = await api.uploader.deleteImage(id)
		if (res?.code !== 200) {
			return field.dispatch({
				type: field.action,
				payload: {
					fieldStatus: 'error',
					value: null
				}
			})
		}
		setUploadedImages([])
		field.dispatch({
			type: field.action,
			payload: {
				fieldStatus: null,
				value: null
			}
		})
	}

	const generateUploader = (field) => {
		const uploader = (
			<>
				<Upload {...uploaderProps(field)}>
					<Button
						disabled={uploadedImages.length > 0 ? true : false}
						icon={<UploadOutlined />}
						style={{ width: '100%' }}
					>
						Subir logo
					</Button>
				</Upload>
				<span
					style={{
						color: 'red',
						display: field.status === 'error' ? 'block' : 'none'
					}}
				>
					No se pudo realizar esta acción.
				</span>
			</>
		)
		return uploader
	}

	// ------------------------------------ Form items --------------------------------------- //
	const generateFormItems = () => {
		const fields = [...data.fields, buttonToSave]
		const inputs = []
		for (let index = 0; index < fields.length; index++) {
			const field = fields[index]
			const fieldCol = (
				<Col
					key={'home_first_steps_' + index}
					lg={{ span: responsiveGrid.span.lg }}
					md={{ span: responsiveGrid.span.md }}
					sm={{ span: responsiveGrid.span.sm }}
					xl={{ span: responsiveGrid.span.xl }}
					xs={{ span: responsiveGrid.span.xs }}
					xxl={{ span: responsiveGrid.span.xxl }}
				>
					{field?.props?.id === 'buttonToSave' ? buttonToSave : null}
					{field?.type === 'datePicker' ? generateDatePicker(field) : null}
					{field?.type === 'input' ? generateInput(field) : null}
					{field?.type === 'select' ? generateSelect(field) : null}
					{field?.type === 'uploader' ? generateUploader(field) : null}
				</Col>
			)
			inputs.push(fieldCol)
		}
		return inputs
	}

	const responsiveGrid = {
		gutter: { horizontal: 8, vertical: 8 },
		span: { lg: 12, md: 12, sm: 24, xl: 12, xs: 24, xxl: 12 }
	}


	return (
		<Row gutter={[responsiveGrid.gutter.horizontal, responsiveGrid.gutter.vertical]}>
			{generateFormItems()}
		</Row>
	)
}

export default Form