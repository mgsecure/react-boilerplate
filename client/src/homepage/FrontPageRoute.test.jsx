import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import HomepageRoute from './HomepageRoute.jsx'

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

describe('HomepageRoute', () => {
  it('renders the Lockpickers United title', () => {
    renderWithProviders(<HomepageRoute />)
    expect(screen.getByText('Lockpickers United')).toBeInTheDocument()
  })
})
