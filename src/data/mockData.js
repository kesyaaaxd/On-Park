export const users = [
  {
    id: 1,
    username: 'admin01',
    password: 'admin123',
    role: 'Administrator'
  },
  {
    id: 2,
    username: 'client01',
    password: 'client123',
    role: 'Client'
  }
]

export const parkingLocations = [
  {
    id: 1,
    name: 'Central Mall Parking',
    address: 'Jakarta',
    totalSlots: 20,
    availableSlots: 15,
    pricePerHour: 5000
  },
  {
    id: 2,
    name: 'City Center Parking',
    address: 'Tangerang',
    totalSlots: 15,
    availableSlots: 8,
    pricePerHour: 4000
  },
  {
    id: 3,
    name: 'Grand Parking',
    address: 'Bekasi',
    totalSlots: 25,
    availableSlots: 22,
    pricePerHour: 3000
  }
]

export const reservations = [
  {
    id: 1,
    clientId: 2,
    parkingId: 1,
    slotNumber: 'A-12',
    startTime: '10:00',
    endTime: '12:00',
    vehicleNumber: 'B 1234 ABC',
    status: 'Confirmed'
  },
  {
    id: 2,
    clientId: 2,
    parkingId: 2,
    slotNumber: 'B-05',
    startTime: '14:00',
    endTime: '16:00',
    vehicleNumber: 'B 5678 XYZ',
    status: 'Completed'
  }
]

export const parkingSlots = [
  {
    id: 1,
    parkingId: 1,
    slotNumber: 'A-01',
    status: 'Available'
  },
  {
    id: 2,
    parkingId: 1,
    slotNumber: 'A-02',
    status: 'Reserved'
  },
  {
    id: 3,
    parkingId: 1,
    slotNumber: 'A-03',
    status: 'Occupied'
  },
  {
    id: 4,
    parkingId: 1,
    slotNumber: 'A-04',
    status: 'Maintenance'
  },
  {
    id: 5,
    parkingId: 2,
    slotNumber: 'B-01',
    status: 'Available'
  },
  {
    id: 6,
    parkingId: 2,
    slotNumber: 'B-02',
    status: 'Held'
  },
  {
    id: 7,
    parkingId: 3,
    slotNumber: 'C-01',
    status: 'Available'
  },
  {
    id: 8,
    parkingId: 3,
    slotNumber: 'C-02',
    status: 'Occupied'
  }
]