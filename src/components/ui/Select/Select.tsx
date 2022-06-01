import React, { FC, useMemo, useState } from 'react'
import { useOnClickOutside } from '../../../hooks/useOnClickOutside'
import Input from '../Input/Input'
import './Select.scss'
interface ISelectProps {
  value: string,
  label: string,
  onChange: (arg0: any) => void,
  onSelect: (arg0: any) => void,
  options: any[],
  classes?: string
}



const getFilteredOptions = (query: string, options: any[], label: string) => {
  if (!query) {
    return options;
  }

  return options.filter(option => option[label].includes(query));
}


const Select: FC<ISelectProps> = ({ label, onChange, options, value, classes, onSelect }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [isMenuOpen, setMenuState] = useState<boolean>(false)

  useOnClickOutside(ref, () => setMenuState(false));

  const computedOptions = useMemo(() => getFilteredOptions(value, options, label), [value, options, label])

  const selectOption = (option: any) => {
    onSelect(option)
    onChange(option[label])
  }

  return (
    <div className={"select-container " + classes} ref={ref} onClick={() => setMenuState(!isMenuOpen)}>
      <Input
        label='Выберите из списка'
        name='select'
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      />
      {isMenuOpen &&
        <ul className="select-options">
          {computedOptions.map((option, index) => (
            <li className="select-options__item" key={index} onClick={() => selectOption(option)}>
              {option[label]}
            </li>
          ))}
        </ul>
      }
    </div>
  )
}

export default Select
