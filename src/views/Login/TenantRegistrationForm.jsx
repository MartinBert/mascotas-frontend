import React, { useState } from 'react'
import { Col, Input, Modal, Row } from 'antd'
import { errorAlert, successAlert } from '../../components/alerts'
import helpers from '../../helpers'
import api from '../../services'

const { regExp } = helpers.stringHelper
const { ifNotNumber } = regExp


const TenantRegistrationForm = () => {
    const [cuit, setCuit] = useState('')
    const [cuitError, setCuitError] = useState(false)
    const [devPassword, setDevPassword] = useState('')
    const [devPasswordError, setDevPasswordError] = useState('')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState(false)
    const [modalVisibility, setModalVisibility] = useState(false)
    const [name, setName] = useState('')
    const [nameError, setNameError] = useState(false)
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(false)

    // -------------------- Actions ---------------------- //
    const clearParams = () => {
        setCuit('')
        setDevPassword('')
        setEmail('')
        setName('')
        setPassword('')
        setCuitError(false)
        setDevPasswordError(false)
        setEmailError(false)
        setNameError(false)
        setPasswordError(false)
    }

    const closeModal = () => {
        setModalVisibility(false)
    }

    const openModal = () => {
        setModalVisibility(true)
    }

    const validateData = () => {
        const devPasswordIsCorrect = devPassword === process.env.REACT_APP_DEV_PASSWORD
        const cuitContainsElevenDigits = cuit.length === 11
        const emailContainsOneOnlyAtSign = email.length > 0 && email.match('@').length === 1
        const emailContainsAlmostEightDigits = email.length >= 8
        const nameContainsAlmostOneDigit = name.length >= 1
        const passwordContainsAlmostFourDigits = password.length >= 4

        let isValidData = false
        if (!devPasswordIsCorrect) {
            setDevPasswordError(true)
        } else if (!cuitContainsElevenDigits) {
            setCuitError(true)
        } else if (!emailContainsOneOnlyAtSign || !emailContainsAlmostEightDigits) {
            setEmailError(true)
        } else if (!nameContainsAlmostOneDigit) {
            setNameError(true)
        } else if (!passwordContainsAlmostFourDigits) {
            setPasswordError(true)
        } else {
            isValidData = true
        }
        return isValidData
    }

    const saveTenant = async () => {
        const validData = validateData()
        if (!validData) return
        
        const newTenant = { cuit, email, name }
        const createTenantResponse = await api.tenants.save(newTenant)
        if (createTenantResponse.status !== 'OK') {
            return errorAlert('No se pudo crear el nuevo inquilino.')
        } else {
            const newUserData = {
                email,
                nombre: name,
                password,
                perfil: true
            }
            const newlyUser = true
            const tenantId = newTenant.cuit
            const createUserResponse = await api.users.save(newUserData, tenantId, newlyUser)
            if (createUserResponse.status !== 'OK') {
                return errorAlert('No se pudo crear el nuevo usuario.')
            } else {
                successAlert('Nuevo inquilino y usuario creados.')
                clearParams()
                setModalVisibility(false)
            }
        }
    }

    // ------------------ Input cuit --------------------- //
    const onChangeCuit = (e) => {
        const parseValue = e.target.value.replace(ifNotNumber, '')
        const fixValue = parseValue.length > 11 ? parseValue.slice(0, -1) : parseValue
        setCuit(fixValue)
        setCuitError(false)
    }

    const InputCuit = (
        <div>
            <Input
                allowClear
                onChange={onChangeCuit}
                placeholder='CUIT'
                status={cuitError ? 'error' : ''}
                value={cuit}
            />
            {
                cuitError
                    ? (
                        <span style={{ color: 'red' }}>
                            Escriba una CUIT válida, once dígitos.
                        </span>
                    )
                    : ''
            }
        </div>
    )

    // -------------- Input dev password ----------------- //
    const onChangeDevPassword = (e) => {
        setDevPassword(e.target.value)
        setDevPasswordError(false)
    }

    const InputDevPassword = (
        <div>
            <Input
                allowClear
                onChange={onChangeDevPassword}
                placeholder='Dev password'
                status={devPasswordError ? 'error' : ''}
                value={devPassword}
            />
            {
                devPasswordError
                    ? (
                        <span style={{ color: 'red' }}>
                            La contraseña Dev es incorrecta.
                        </span>
                    )
                    : ''
            }
        </div>
    )

    // ------------------ Input email -------------------- //
    const onChangeEmail = (e) => {
        setEmail(e.target.value)
        setEmailError(false)
    }

    const InputEmail = (
        <div>
            <Input
                allowClear
                onChange={onChangeEmail}
                placeholder='Email'
                status={emailError ? 'error' : ''}
                value={email}
            />
            {
                emailError
                    ? (
                        <span style={{ color: 'red' }}>
                            Escriba una dirección email válida.
                        </span>
                    )
                    : ''
            }
        </div>
    )

    // ------------------- Input name -------------------- //
    const onChangeName = (e) => {
        setName(e.target.value)
        setNameError(false)
    }

    const InputName = (
        <div>
            <Input
                allowClear
                onChange={onChangeName}
                placeholder='Nombre usuario'
                status={nameError ? 'error' : ''}
                value={name}
            />
            {
                nameError
                    ? (
                        <span style={{ color: 'red' }}>
                            Escriba un nombre válido.
                        </span>
                    )
                    : ''
            }
        </div>
    )

    // ---------------- Input password ------------------- //
    const onChangePassword = (e) => {
        setPassword(e.target.value)
        setPasswordError(false)
    }

    const InputPassword = (
        <div>
            <Input
                allowClear
                onChange={onChangePassword}
                placeholder='Password'
                status={passwordError ? 'error' : ''}
                value={password}
            />
            {
                passwordError
                    ? (
                        <span style={{ color: 'red' }}>
                            Escriba una contraseña válida de al menos 4 dígitos.
                        </span>
                    )
                    : ''
            }
        </div>
    )


    return (
        <>
            <div
                onClick={openModal}
                style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
            >
                Tenant Registration
            </div>
            <Modal
                onCancel={closeModal}
                onOk={saveTenant}
                open={modalVisibility}
                title='Nuevo inquilino'
                width={1000}
            >
                <Row
                    align='middle'
                    gutter={[8, 8]}
                    justify='center'
                >
                    <Col span={24}>
                        {InputCuit}
                    </Col>
                    <Col span={24}>
                        {InputName}
                    </Col>
                    <Col span={24}>
                        {InputEmail}
                    </Col>
                    <Col span={24}>
                        {InputPassword}
                    </Col>
                    <hr />
                    <Col span={24}>
                        {InputDevPassword}
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

export default TenantRegistrationForm