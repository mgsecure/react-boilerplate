import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import FrontPageRoute from './FrontPageRoute.jsx'

function renderWithProviders(ui) {
  const theme = createTheme({ palette: { mode: 'light' } })
  return render(
    <ThemeProvider theme={theme}>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </ThemeProvider>
  )
}

describe('FrontPageRoute', () => {
  it('renders the Lockpickers United title', () => {
    renderWithProviders(<FrontPageRoute />)
    expect(screen.getByText('Lockpickers United')).toBeInTheDocument()
  })
})
