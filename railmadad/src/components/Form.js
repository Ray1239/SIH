import React, { useState } from 'react';

function Form({ onFormSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    typeOfComplaint: '',
    description: '',
    file: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      file: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
      <select name="typeOfComplaint" value={formData.typeOfComplaint} onChange={handleChange}>
        <option value="">Select...</option>
        <option value="cleanliness">Cleanliness</option>
        <option value="damage">Damage</option>
        <option value="safety">Safety</option>
      </select>
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"></textarea>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Form;
