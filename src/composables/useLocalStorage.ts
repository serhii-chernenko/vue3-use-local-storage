import type { Ref } from 'vue'
import { shallowRef, watchEffect, toValue, onMounted, onUnmounted } from 'vue'

export const useLocalStorage = (
    key: string,
    defaultValue: string,
): Ref<string> => {
    const value = shallowRef<string>(localStorage.getItem(key) ?? defaultValue)

    watchEffect(() => localStorage.setItem(key, toValue(value)))

    const listener = (event: StorageEvent) => {
        if (event.key !== key) {
            return
        }

        value.value = event.newValue ?? defaultValue
    }

    onMounted(() => {
        window.addEventListener('storage', listener)
    })

    onUnmounted(() => {
        window.removeEventListener('storage', listener)
    })

    return value
}
