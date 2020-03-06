import React from 'react'
import Form from 'muicss/lib/react/form'
import Row from 'muicss/lib/react/row'
import Col from 'muicss/lib/react/col'

import { osmGeocode } from '../lib/osm'
import { MyInput } from './util/Input'
import { RoundedButton } from './util/Button'
import { client } from '../lib/trpc'
import { QueryContainer, AddressContainer } from '../lib/state'
import { StateForm } from './states/StateForm'


const defaultAddr = '301 N Olive Ave, West Palm Beach, FL 33401'

export const InitialForm: React.StatelessComponent = () => {
  let addrRef: HTMLInputElement | null
  let unitRef: HTMLInputElement | null
  const { setAddress } = AddressContainer.useContainer()
  const { startLoad, setError, clearError } = QueryContainer.useContainer()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.persist()  // allow async function call
    event.preventDefault()

    if (!addrRef || !unitRef) return

    const inputAddr = addrRef.value

    startLoad()
    const newLocale = await osmGeocode(inputAddr, unitRef.value)
    setAddress(newLocale)
    if (newLocale) {
      clearError()
      const result = await client.addLocale(newLocale)
      if (result.type === 'data') {
        setAddress({...newLocale, id: result.data})
      }
    } else {
      setError(`No address found for "${inputAddr}"`)
    }
  }

  return <>
    <Form onSubmit={handleSubmit}>
      <legend>Enter your address to see if you can Vote by Mail</legend>
      <Row>
        <Col sm={10} xs={12}>
          <MyInput
            label='Address (without Apt or Unit #)'
            floatingLabel={true}
            inputRef={el => addrRef = el}
            defaultValue={defaultAddr}
          />
        </Col>
        <Col sm={2} xs={12}>
          <MyInput
            label='Unit #'
            floatingLabel={true}
            inputRef={el => unitRef = el}
          />
        </Col>
      </Row>
      <RoundedButton color='primary' variant='raised'>Can I vote by Mail?</RoundedButton>
    </Form>
    <StateForm />
  </>
}
