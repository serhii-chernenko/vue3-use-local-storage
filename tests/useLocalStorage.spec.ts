import { describe, it, expect, beforeEach } from 'vitest'
import { createApp } from 'vue'
import { useLocalStorage } from '../src/composables/useLocalStorage'

const storageKey = 'test'

const withSetup = (composable) => {
    let result
    const app = createApp({
        setup() {
            result = composable()

            return () => {}
        },
    })

    app.mount(document.createElement('div'))

    return [result, app]
}

beforeEach(() => localStorage.clear())

describe('useLocalStorage', () => {
    it('should work w/ default value', () => {
        const [storage, app] = withSetup(() => {
            return useLocalStorage(storageKey, 'default')
        })

        expect(storage.value).toBe('default')
        expect(localStorage.getItem(storageKey)).toBe('default')

        app.unmount()
    })

    it('should work w/ storage event', () => {
        const [storage, app] = withSetup(() => {
            return useLocalStorage(storageKey, 'default')
        })
        const storageEvent = new StorageEvent('storage', {
            key: storageKey,
            newValue: 'new value',
        })

        window.dispatchEvent(storageEvent)

        expect(storage.value).toBe('new value')

        app.unmount()
    })
})
