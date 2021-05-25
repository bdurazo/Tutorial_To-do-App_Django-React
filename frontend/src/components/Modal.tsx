import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

interface todoItem{
  id?: number,
  title: string,
  description: string,
  completed: boolean,
}

interface CustomModalProps{
  activeItem: todoItem,
  toggle: ()=>void,
  onSave: (item: todoItem)=>void
}

export default function CustomModal(props: CustomModalProps) {
  const [ItemValue, setValue] = useState(props.activeItem)
  const [AppProps] = useState(props);

  function updateItems(e: React.ChangeEvent<HTMLInputElement>){
    let { name, value} = e.currentTarget;

    const activeItem = { ...ItemValue, [name]: value };

    setValue(activeItem);
  }
  
  const { toggle, onSave } = AppProps;

    return (
      <Modal isOpen={true} toggle={toggle}>
        <ModalHeader toggle={toggle}>Todo Item</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="todo-title">Title</Label>
              <Input
                type="text"
                id="todo-title"
                name="title"
                value={ItemValue.title}
                onChange={updateItems}
                placeholder="Enter Todo Title"
              />
            </FormGroup>
            <FormGroup>
              <Label for="todo-description">Description</Label>
              <Input
                type="text"
                id="todo-description"
                name="description"
                value={ItemValue.description}
                onChange={updateItems}
                placeholder="Enter Todo description"
              />
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  name="completed"
                  checked={ItemValue.completed}
                  onChange={updateItems}
                />
                Completed
              </Label>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => onSave(ItemValue)}
          >
            Save
          </Button>
        </ModalFooter>
      </Modal>
    );
}

