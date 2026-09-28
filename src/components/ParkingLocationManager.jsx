import { useState } from 'react'

function ParkingLocationManager({
  parkingData,
  onAdd,
  onEdit,
  onDelete
}) {
  const [showForm, setShowForm] = useState(false)

  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    totalSlots: '',
    availableSlots: '',
    pricePerHour: ''
  })

  function resetForm() {
    setFormData({
      name: '',
      address: '',
      totalSlots: '',
      availableSlots: '',
      pricePerHour: ''
    })

    setEditingId(null)
    setShowForm(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const locationData = {
      name: formData.name,
      address: formData.address,
      totalSlots: Number(formData.totalSlots),
      availableSlots: Number(formData.availableSlots),
      pricePerHour: Number(formData.pricePerHour)
    }

    if (editingId) {
      onEdit(editingId, locationData)
    } else {
      onAdd(locationData)
    }

    resetForm()
  }

  function handleEdit(parking) {
    setFormData({
      name: parking.name,
      address: parking.address,
      totalSlots: parking.totalSlots,
      availableSlots: parking.availableSlots,
      pricePerHour: parking.pricePerHour
    })

    setEditingId(parking.id)
    setShowForm(true)
  }

  return (
    <div className="page-container">

      <div className="page-header">
        <div>
          <h2>Parking Locations</h2>
          <p>
            Manage your parking locations.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null)
            setShowForm(true)
          }}
        >
          + Add Location
        </button>
      </div>

      {showForm && (
        <div className="form-card">

          <h3>
            {editingId
              ? 'Edit Parking Location'
              : 'Add Parking Location'}
          </h3>

          <form onSubmit={handleSubmit}>

            <label>Parking Name</label>

            <input
              type="text"
              value={formData.name}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  name: event.target.value
                })
              }
              required
            />

            <label>Address</label>

            <input
              type="text"
              value={formData.address}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  address: event.target.value
                })
              }
              required
            />

            <label>Total Slots</label>

            <input
              type="number"
              value={formData.totalSlots}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  totalSlots: event.target.value
                })
              }
              required
            />

            <label>Available Slots</label>

            <input
              type="number"
              value={formData.availableSlots}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  availableSlots: event.target.value
                })
              }
              required
            />

            <label>Price per Hour</label>

            <input
              type="number"
              value={formData.pricePerHour}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  pricePerHour: event.target.value
                })
              }
              required
            />

            <div className="form-actions">

              <button type="submit">
                {editingId ? 'Save Changes' : 'Add Location'}
              </button>

              <button
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      <div className="location-list">

        {parkingData.map((parking) => (
          <div
            className="location-card"
            key={parking.id}
          >

            <div>
              <h3>{parking.name}</h3>

              <p>{parking.address}</p>

              <p>
                {parking.availableSlots} / {parking.totalSlots}
                {' '}slots available
              </p>

              <p>
                Rp {parking.pricePerHour.toLocaleString('id-ID')}
                /hour
              </p>
            </div>

            <div className="card-actions">

              <button
                onClick={() => handleEdit(parking)}
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(parking.id)}
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  )
}

export default ParkingLocationManager