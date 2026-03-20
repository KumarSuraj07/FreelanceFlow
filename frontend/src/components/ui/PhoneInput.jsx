import { useState, useEffect } from 'react'
import { COUNTRY_CODES } from '../../utils/phoneCodes'

export default function PhoneInput({ value = '', onChange, error, disabled = false }) {
  const parseValue = (v) => {
    const match = COUNTRY_CODES.find(c => v.startsWith(c.code + ' '))
    if (match) return { code: match.code, number: v.slice(match.code.length + 1) }
    return { code: '+1', number: v.replace(/^\+\d+\s?/, '') }
  }

  const parsed = parseValue(value)
  const [code, setCode] = useState(parsed.code)
  const [number, setNumber] = useState(parsed.number)

  useEffect(() => {
    const p = parseValue(value)
    setCode(p.code)
    setNumber(p.number)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleCodeChange = (e) => {
    setCode(e.target.value)
    onChange(number ? `${e.target.value} ${number}` : '')
  }

  const handleNumberChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '')
    setNumber(cleaned)
    onChange(cleaned ? `${code} ${cleaned}` : '')
  }

  return (
    <div className="flex gap-2">
      <select
        value={code}
        onChange={handleCodeChange}
        disabled={disabled}
        className="px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white min-w-[90px] disabled:bg-gray-50 disabled:text-gray-600"
      >
        {COUNTRY_CODES.map(c => (
          <option key={c.code + c.country} value={c.code}>
            {c.flag} {c.code}
          </option>
        ))}
      </select>
      <input
        type="tel"
        value={number}
        onChange={handleNumberChange}
        placeholder="Phone number"
        inputMode="numeric"
        disabled={disabled}
        className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm disabled:bg-gray-50 disabled:text-gray-600 ${error ? 'border-red-400' : 'border-gray-300'}`}
      />
    </div>
  )
}
