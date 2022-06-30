import { createContext } from 'react'
import { components } from 'schema'

export const UserContext = createContext<components['schemas']['User'] | undefined>(undefined)
