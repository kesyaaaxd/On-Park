import { useState } from 'react'
import {
  Pencil,
  Plus,
  SquareParking,
  Trash2
} from 'lucide-react'

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

    const newSlotData = {
      parkingId: Number(selectedParkingId),
      slotNumber: formData.slotNumber,
      status: formData.status
    }

    if (editingId) {
      onEdit(editingId, newSlotData)
    } else {
      onAdd(newSlotData)
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
          className="btn-primary"
          onClick={() => {
            setEditingId(null)
            setFormData({
              slotNumber: '',
              status: 'Available'
            })
            setShowForm(true)
          }}
        >
          <Plus size={16} />
          Add Slot
        </button>

      </div>

      <div className="parking-selector">

        <label htmlFor="slot-parking-select">
          Select Parking Location
        </label>

        <select
          id="slot-parking-select"
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

            <label htmlFor="slot-number">
              Slot Number
            </label>

            <input
              id="slot-number"
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

            <label htmlFor="slot-status">
              Status
            </label>

            <select
              id="slot-status"
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

              <button
                type="submit"
                className="btn-primary"
              >
                {editingId ? (
                  <Pencil size={15} />
                ) : (
                  <Plus size={15} />
                )}
                {editingId ? 'Save Changes' : 'Add Slot'}
              </button>

              <button
                type="button"
                className="btn-ghost"
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
          <div className="form-card empty-card">
            <div className="icon-badge neutral lg">
              <SquareParking size={28} />
            </div>

            <h3>No Slots Yet</h3>

            <p>
              No parking slots available for this location.
            </p>
          </div>
        ) : (
          filteredSlots.map((slot) => (
            <div
              className="slot-card"
              key={slot.id}
            >

              <div
                className={`icon-badge sm status-${slot.status.toLowerCase()}`}
              >
                <SquareParking size={16} />
              </div>

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
                  className="btn-ghost"
                  onClick={() => handleEdit(slot)}
                >
                  <Pencil size={14} />
                  Edit
                </button>

                <button
                  className="btn-danger-ghost"
                  onClick={() => onDelete(slot.id)}
                >
                  <Trash2 size={14} />
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
