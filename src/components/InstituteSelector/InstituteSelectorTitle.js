import React from 'react';

function getInstitutesSelectedTitle(length) {
  if (length === 0) {
    return "no institute selected";
  } else if (length === 1) {
    return "1 institute selected";
  }
  return `${length} institutes selected`;
}

const InstituteSelectorTitle = ({ count }) => (
  <span>{getInstitutesSelectedTitle(count)}</span>
);

export default InstituteSelectorTitle;