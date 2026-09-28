import { useState } from 'react'

function ParkingSlotManager({
  parkingData,
  slotData,
  onAdd,
  onEdit,
  onDelete
}) {
  const [selectedParkingId, setSelectedParkingId] = useState(
    parkingData[0]?.id || ''
  )

  const [showForm, setShowForm] = useState(false)

  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    slotNumber: '',
    status: 'Available'
  })

  const filteredSlots = slotData.filter(
    (slot) => slot.parkingId === Number(selectedParkingId)
  )

  function resetForm() {
    setFormData({
      slotNumber: '',
      status: 'Available'
    })

    setEditingId(null)
    setShowForm(false)
  }

  function handleSubmit(event) {
    event.preventDefault()

    const slotData = {
      parkingId: Number(selectedParkingId),
      slotNumber: formData.slotNumber,
      status: formData.status
    }

    if (editingId) {
      onEdit(editingId, slotData)
    } else {
      onAdd(slotData)
    }

    resetForm()
  }

  function handleEdit(slot) {
    setFormData({
      slotNumber: slot.slotNumber,
      status: slot.status
    })

    setEditingId(slot.id)
    setShowForm(true)
  }

  return (
    <div className="page-container">

      <div className="page-header">

        <div>
          <h2>Parking Slots</h2>

          <p>
            Manage parking slots and their current status.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingId(null)
            setFormData({
              slotNumber: '',
              status: 'Available'
            })
            setShowForm(true)
          }}
        >
          + Add Slot
        </button>

      </div>

      <div className="parking-selector">

        <label>
          Select Parking Location
        </label>

        <select
          value={selectedParkingId}
          onChange={(event) =>
            setSelectedParkingId(event.target.value)
          }
        >
          {parkingData.map((parking) => (
            <option
              key={parking.id}
              value={parking.id}
            >
              {parking.name}
            </option>
          ))}
        </select>

      </div>

      {showForm && (
        <div className="form-card">

          <h3>
            {editingId
              ? 'Edit Parking Slot'
              : 'Add Parking Slot'}
          </h3>

          <form onSubmit={handleSubmit}>

            <label>
              Slot Number
            </label>

            <input
              type="text"
              placeholder="Example: A-01"
              value={formData.slotNumber}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  slotNumber: event.target.value
                })
              }
              required
            />

            <label>
              Status
            </label>

            <select
              value={formData.status}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  status: event.target.value
                })
              }
            >
              <option value="Available">
                Available
              </option>

              <option value="Held">
                Held
              </option>

              <option value="Reserved">
                Reserved
              </option>

              <option value="Occupied">
                Occupied
              </option>

              <option value="Maintenance">
                Maintenance
              </option>
            </select>

            <div className="form-actions">

              <button type="submit">
                {editingId
                  ? 'Save Changes'
                  : 'Add Slot'}
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

      <div className="slot-list">

        {filteredSlots.length === 0 ? (
          <p>
            No parking slots available for this location.
          </p>
        ) : (
          filteredSlots.map((slot) => (
            <div
              className="slot-card"
              key={slot.id}
            >

              <div>
                <h3>
                  Slot {slot.slotNumber}
                </h3>

                <p>
                  Status: {slot.status}
                </p>
              </div>

              <div className="card-actions">

                <button
                  onClick={() => handleEdit(slot)}
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(slot.id)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  )
}

export default ParkingSlotManager