import styled from "styled-components";

export const ModalDiv = styled("div")`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.secondary};
  padding: 50px;
  min-width: 300px;
  border-radius: 10px;
`;

export const ModalDivInner = styled("div")`
  display: flex;
  margin-bottom: 30px;
`;

export const AddButton = styled("button")`
  background: ${({ theme }) => theme.colors.tertiary2};
  border: none;
  border-radius: 5px;
  padding: 15px;
  font-size: 1rem;
  width: 100%;
  font-weight: 600;
  text-align: center;
  color: white;
  text-decoration: none;
  text-transform: uppercase;
  display: block;
  transition: 300ms;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.tertiary};
  }
`;
export const CancelButton = styled("button")`
  background: ${({ theme }) => theme.colors.secondary};
  border: none;
  border-radius: 5px;
  padding: 15px;
  font-size: 1rem;
  width: 100%;
  font-weight: 600;
  text-align: center;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  text-transform: uppercase;
  display: block;
  transition: 300ms;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.secondary2};
  }
`;
export const ButtonsDiv = styled("div")`
  display: flex;
  justify-content: space-between;
  & ${AddButton} {
    margin-right: 10px;
  }
`;

export const InputsDiv = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const AddDatasetDiv = styled("div")`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 5px;
  padding: 10px;
  margin-right: 20px;
  min-width: 300px;
`;
