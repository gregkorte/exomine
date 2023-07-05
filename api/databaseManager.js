// governor requests

export const getGovernor = async (id) => {
  const response = await fetch(`http://localhost:8088/governors/${id}`)
  return response.json()
}

export const getGovernors = async () => {
  const response = await fetch('http://localhost:8088/governors')
  return response.json()
}

export const editGovernor = async (id, obj) => {
  delete obj.id
  const patchOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  }

  const response = await fetch(`http://localhost:8088/governors/${id}`, patchOptions)
  return response.json()
}

// colony requests

export const getColony = async (id) => {
  const response = await fetch(`http://localhost:8088/colonies/${id}`)
  return response.json()
}

export const getColonies = async () => {
  const response = await fetch('http://localhost:8088/colonies')
  return response.json()
}

export const editColony = async (id, obj) => {
  delete obj.id
  const patchOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  }

  const response = await fetch(`http://localhost:8088/colonies/${id}`, patchOptions)
  return response.json()
}

// facility requests

export const getFacilities = async () => {
  const response = await fetch('http://localhost:8088/facilities')
  return response.json()
}

export const getFacility = async (id) => {
  const response = await fetch(`http://localhost:8088/facilities/${id}`)
  return response.json()
}

export const getFacilityInventory = async () => {
  const response = await fetch("http://localhost:8088/facilityInventory?_expand=mineral&_expand=facility")
  return await response.json()
}

export const editFacility = async (id, obj) => {
  delete obj.id
  const patchOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  }

  const response = await fetch(`http://localhost:8088/facilities/${id}`, patchOptions)
  return response.json()
}

// FacilityInventory requests

export const editFacilityInventory = async (id, obj) => {
  delete obj.id
  const patchOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  }

  const response = await fetch(`http://localhost:8088/facilityInventory/${id}`, patchOptions)
  return response.json()
}

// colonyInventory requests

export const getColonyInventory = async () => {
  const response = await fetch("http://localhost:8088/colonyInventory?_expand=mineral")
  return await response.json()
}

export const addColonyInventory = async (obj) => {
  const postOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  }

  const response = await fetch("http://localhost:8088/colonyInventory", postOptions)
  return response.json()
}

export const editColonyInventory = async (id, obj) => {
  const patchOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  }

  const response = await fetch(`http://localhost:8088/colonyInventory/${id}`, patchOptions)
  return response.json()
}

// pirates requests

export const getPirates = async () => {
  const response = await fetch(`http://localhost:8088/pirates`)
  return response.json()
}

export const getPirate = async (id) => {
  const response = await fetch(`http://localhost:8088/pirates/${id}`)
  return response.json()
}

export const getPirateInventory = async () => {
  const response = await fetch(`http://localhost:8088/pirateInventory?_expand=mineral`)
  return response.json()
}

export const editPirateInventory = async (id, obj) => {
  const patchOptions = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  }

  const response = await fetch(`http://localhost:8088/pirateInventory/${id}`, patchOptions)
  return response.json()
}
