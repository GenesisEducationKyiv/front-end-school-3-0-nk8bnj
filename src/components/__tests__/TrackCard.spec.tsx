/* eslint-disable @typescript-eslint/unbound-method */
import { test, expect } from '@playwright/experimental-ct-react'
import TrackCard from '../TrackCard'
import type { Track } from '@/types/schemas'

const mockTrack: Track = {
  id: '1',
  title: 'Test Song',
  artist: 'Test Artist',
  album: 'Test Album',
  genres: ['Rock', 'Alternative'],
  slug: 'test-song',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

test('renders track information correctly', async function(this: void, { mount }) {
  const component = await mount(<TrackCard track={mockTrack} />)

  const title = component.getByTestId('track-item-1-title')
  const artist = component.getByTestId('track-item-1-artist')

  await expect(title).toContainText('Test Song')
  await expect(artist).toContainText('Test Artist')

  await expect(component.getByText('Rock')).toBeVisible()
  await expect(component.getByText('Alternative')).toBeVisible()
})

test('shows action buttons', async function(this: void, { mount }) {
  const component = await mount(<TrackCard track={mockTrack} />)

  await expect(component.getByTestId('edit-track-1')).toBeVisible()
  await expect(component.getByTestId('delete-track-1')).toBeVisible()
  await expect(component.getByTestId('upload-track-1')).toBeVisible()
})

test('handles checkbox interaction', async function(this: void, { mount }) {
  const component = await mount(<TrackCard track={mockTrack} />)

  const checkbox = component.getByTestId('track-checkbox-1')
  await expect(checkbox).toBeVisible()

  await checkbox.click()
  await expect(checkbox).toBeChecked()
})

test('shows no cover image placeholder', async function(this: void, { mount }) {
  const component = await mount(<TrackCard track={mockTrack} />)

  await expect(component.getByText('No cover image')).toBeVisible()
}) 
