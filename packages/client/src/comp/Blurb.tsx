import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useAppHistory } from '../lib/path'
import { client } from '../lib/trpc'
import { AddressContainer } from '../lib/unstated'

import img1k from './img/blurb_bg_max_width_1k.jpg'
import img2k from './img/blurb_bg_max_width_2k.jpg'
import img6k from './img/blurb_bg_max_width_6k.jpg'
import { Button } from 'muicss/react'
import { toast } from 'react-toastify'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const bgFadeIn = keyframes`
  from { background-color: #ffff; }
  to { background-color: #fff0 }
`

const Wrapper = styled.div`
  width: 100%;
  height: calc(var(--vh) * 100);
  box-sizing: border-box;
  position: relative;
  color: #323232;

  /*
    Lightens the bg, since backdrop-filters are not yet fully supported
    on all browsers we create a pseudo-element to fake that effect.
  */
  &::before {
    width: 100%;
    height: calc(var(--vh) * 100);

    content: '';
    display: block;
    background-image: linear-gradient(to bottom right, #fffd, #fffa);

    position: absolute;
    top: 0;
    z-index: 1;

    animation: ${bgFadeIn} ease 5s 1s both;
  }
  /* Makes subsequent elements above the ::after white filter */
  & > div, & > form {
    z-index: 2;
  }

  /* Loads the background image according to the device's screen dimensions */
  @media screen and (max-width: 640px) {
    background-image: url(${img1k});
    background-size: cover;
    background-position-x: 64%;
    background-position-y: 0;
    /* So the content is centered relative to the space subtracted by the Navbar */
    padding-top: calc(var(--vh) * 10);
  }
  @media screen and (min-width: 641px) {
    background-image: url(${img1k});
    background-size: cover;
    background-position-x: 44%;
    background-position-y: 0;
  }
  @media screen and (min-width: 592px) {
    /* At this point the navbar changes size */
    padding-top: calc(var(--vh) * 14);
  }
  @media screen and (min-width: 1281px) {
    background-image: url(${img2k});
    background-size: 115vw;
    background-position-x: 74%;
    background-position-y: 64%;
  }
  @media screen and (min-width: 1920px) {
    background-image: url(${img6k});
    background-size: 100vw;
  }

  display: flex;
  align-items: center;
  justify-content: center;

  /*
    Instead of tweaking individual measurements, we're gonna create a single
    div with a desired height and set its two elements (Headline & GetStarted)
    vertically apart from each other with the flex box.
  */
  & > .container {
    height: 50%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    @media screen and (min-width: 592px) {
      height: 33%;
      margin-bottom: calc(var(--vh) * 22);
    }
  }
`

const Headline = styled.div`
  width: 80%;

  font-family: 'Merriweather', serif;
  font-size: 1.3em;
  text-align: center;
  animation: ${fadeIn} ease 2s both;

  @media screen and (min-width: 592px) {
    width: 70%;
    font-size: 1.7em;
  }
  @media screen and (min-width: 1024px) {
    width: 50%;
    font-size: 1.5em;
  }
  @media screen and (min-width: 1920px) {
    font-size: 2.3em;
  }
`

const GetStarted = styled.form`
  width: 100%;
  height: 30%;
  font-family: 'Open Sans', sans;
  animation: ${fadeIn} ease 2s both;

  @media screen and (min-width: 592px) {
    width: 45%;
  }

  & > p {
    /* Some browsers might have a predefined rule for these */
    padding: 0;
    margin: calc(var(--vh) * 3) 0 calc(var(--vh) * 7);

    font-size: 1.07em;
    text-align: center;

    @media screen and (min-width: 592px) {
      margin: calc(var(--vh) * 6) 0;
    }
  }

  & > .buttonWrapper {
    width: 70%;
    height: calc(var(--vh) * 8);

    margin-left: 15%;

    display: flex;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.1);

    > input, > button {
      box-sizing: border-box;
      border: none;

      :focus { outline: none; }
    }

    @media screen and (min-width: 1025px) {
      width: 50%;
      margin-left: 25%;
      height: calc(var(--vh) * 6);
    }
  }

  & > .buttonWrapper > input {
    width: 60%;
    height: 100%;
    background-color: white;
    padding: 5%;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;

    font-size: 1.04em;
    ::placeholder {
      color: #ccc;
    }

    /* Normalizes webkit autofill customizations */
    :-webkit-autofill,
    :-webkit-autofill:hover,
    :-webkit-autofill:focus {
      font-size: 1.04em;
      /* Using background-color won't work here */
      box-shadow: 0 0 0px 100px white inset;
    }

    /* Hides increment/decrement arrows on webkit */
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Hides increment/decrement arrows on Firefox */
    -moz-appearance: textfield;
  }

  & > .buttonWrapper > button {
    width: 40%;
    height: 100%;

    border-radius: 0 4px 4px 0;
    margin: 0;

    @media screen and (min-width: 592px) {
      /* Since the button's width is always related  */
      font-size: 1vw;
    }
  }
`

export const Blurb: React.FC = () => {
  const { path, pushAddress } = useAppHistory()
  const { address } = AddressContainer.useContainer()
  const zipRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.persist()  // allow async function call
    event.preventDefault()
    const zip = zipRef?.current?.value
    if (!zip) return
    const resp = await client.fetchState(zip)
    if (resp.type === 'error') {
      toast(
`Something wrong happened while querying for your ZIP Code.
We're sorry this happened, if you try again and the error persists try contacting us.`,
        {type: 'error'},
      )
    } else {
      pushAddress(resp.data, zip)
    }

  }

  const defaultValue = () => {
    if (path?.type === 'address' && path.zip) {
      return path.zip
    } else {
      return address?.postcode ?? undefined
    }
  }

  return <Wrapper>
    <div className="container">
      <Headline>MailMyBallot streamlines state vote-by-mail applications by digitizing the voter’s signup process.</Headline>
      <GetStarted onSubmit={handleSubmit}>
        <p>Enter your ZIP Code to get started</p>
        <div className="buttonWrapper">
          <input
            type='number'
            placeholder='Enter ZIP Code'
            id='start-zip'
            data-testid='start-zip'
            pattern='[0-9]{5}'
            defaultValue={defaultValue()}
            ref={zipRef}
          />
          <Button
            color='primary'
            id='start-submit'
            data-testid='start-submit'
          >
            Enter
          </Button>
        </div>
      </GetStarted>
    </div>
  </Wrapper>
}
