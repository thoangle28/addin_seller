import React, { Fragment } from "react";

const Options = [
  { value: 'enabled', label: 'Enabled' },
  { value: 'downloadable', label: 'Downloadable' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'manage_stock', label: 'Manage stock?' }
]

const VariantOption = () => {
  return (
    <>      
      {Options.map((option) => {
        return (
          <Fragment key={option.value}>
            <div className='form-check form-check-custom form-check-solid mb-4'>
              <label className='form-check-label ms-0 d-flex align-items-center'>
                <input
                  type='checkbox'
                  name={option.value}
                  value={option.value}
                  className='form-check-input me-2'
                  id={option.value}
                 /*  checked={value && value === option.value}
                  onChange={(e) => {
                    fieldChanged(field._uid, e.target.value);
                  } */
                />
                {option.label}
              </label>
            </div>
          </Fragment>
        );
      })}
    </>
  );
};

export default VariantOption