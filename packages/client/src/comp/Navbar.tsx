import React from 'react'
import styled, { keyframes } from 'styled-components'

import logo from './img/logo.png'
import { Button } from 'muicss/react'
import { Link } from 'react-router-dom'


interface NavExpanded {
  expanded: boolean
}

const queryOnMobile = '@media screen and (max-width: 768px)'
const queryOnDesktop = '@media screen and (min-width: 769px)'
const queryOnBigDesktop = '@media screen and (min-width: 1920px)'

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`

const Wrapper = styled.div<NavExpanded>`
  --height: calc(var(--vh) * 10);
  --expandedHeight: calc(var(--vh) * 50);
  --verticalPad: calc(var(--vh) * 1);
  /* The height inside the padded area */
  --contentHeight: calc(var(--height) - var(--verticalPad) - var(--verticalPad));
  ${queryOnDesktop} {
    --height: calc(var(--vh) * 12);
    --expandedHeight: var(--height);
  }
  ${queryOnBigDesktop} {
    --height: calc(var(--vh) * 10);
  }

  width: 100%;
  height: var(${p => p.expanded ? '--expandedHeight' : '--height'});
  padding: var(--verticalPad) 5%;
  box-sizing: border-box;

  position: fixed;
  top: 0;

  background-color: #fff;
  box-shadow: 0px 4px 2px rgba(0, 0, 0, 0.05);

  z-index: 10;

  display: flex;
  flex-flow: row wrap;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: space-between;

  transition: height ease .45s;
`

const Logo = styled(Link)`
  height: var(--contentHeight);
  /* Total space - NavToggle size */
  width: calc(99% - var(--contentHeight));
  ${queryOnDesktop} { width: 30%; }

  /* Centers image on the padded, non-expanded area */
  display: flex;
  align-items: center;

  img {
    height: 100%;
    ${queryOnDesktop} { height: 70%; }
  }
`

const NavToggle = styled(Button)<NavExpanded>`
  --color: ${p => p.expanded ? '#f44336' : '#2196f3'};
  --wrapperSize: var(--contentHeight);
  --iconSize: calc(var(--wrapperSize) * 0.4);
  --iconRotation: ${p => p.expanded ? '-90deg' : '0'};

  /* In order to make the Material Ripple a perfect circle */
  width: var(--contentHeight);
  height: var(--contentHeight);
  border-radius: var(--contentHeight);
  margin: 0;

  /* The Material Ripple already indicates interaction */
  :hover, :focus { background-color: #fff !important; }

  /* Centers icon */
  display: none;
  ${queryOnMobile} { display: flex; }
  align-items: center;
  justify-content: center;

  i {
    font-size: var(--iconSize);
    color: var(--color);
    transform: rotate(var(--iconRotation));
    transition: color ease .3s, transform ease .15s;
  }
`

const NavLinks = styled.div<NavExpanded>`
  display: ${p => p.expanded ? 'flex' : 'none'};
  width: 120%;
  height: calc(
    var(--expandedHeight) - var(--contentHeight) - var(--verticalPad) - var(--verticalPad)
  );

  ${queryOnMobile} {
    flex-direction: column;

    box-shadow: 0 4px 3px rgba(0, 0, 0, 0.05) inset;
    /* Makes the shadow ignore the Wrapper horizontal padding */
    margin: 0 -10%;
    animation: ${fadeIn} ease .5s .3s both;

    /* When animating, doesn't let the content be drawn on top of the logo/toggle button */
    z-index: -1;
  }

  ${queryOnDesktop} {
    display: flex;
    flex-direction: row;
    width: 50%;
    height: 100%;
    font-size: 0.7em;
  }

  ${queryOnBigDesktop} {
    font-size: 0.85em;
  }

  justify-content: space-around;
  align-items: center;

  a {
    color: inherit;
    font-weight: bold;
    text-transform: uppercase;

    &.register, :hover, :focus, :active {
      color: #2196f3;
      text-decoration: none;
    }

    transition: color ease .2s;
  }
`

export const Navbar = () => {
  const [expanded, setExpanded] = React.useState(false)

  const toggleExpanded = () => setExpanded(!expanded)

  return <Wrapper expanded={expanded}>
    <Logo to="/">
        <img src={logo} alt="Mail My Ballot"/>
    </Logo>
    <NavToggle onClick={toggleExpanded} expanded={expanded} variant="flat">
      <i className={`fa ${expanded ? 'fa-close' : 'fa-navicon'}`}/>
    </NavToggle>
    <NavLinks expanded={expanded}>
      <Link to="/about">About</Link>
      {/*
        These are temporary links, once these sections are implemented all
        anchor elements will be replaced with proper Link elements.
      */}
      <a href="#">Team</a>
      <a href="#">Get Involved</a>
      <a href="#">Contact Us</a>
      <a className="register" href="#">Register</a>
    </NavLinks>
  </Wrapper>
}
