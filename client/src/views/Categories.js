import axios from "axios";
import React, {useState, useEffect, useRef, useMemo} from "react";
import {mode, headers, localIP } from "data/constants/constants"
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  Tooltip,
  OverlayTrigger,
  Modal,
  ModalDialog
} from "react-bootstrap";



function Categories() {
  const [category, setCategory] = useState();
  const [categoryDisabled, setCategoryDisabled] = useState(true);
  const [categoryUpdateDisabled, setCategoryUpdateDisabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState([{}]);
  const [categoryUpdate, setCategoryUpdate]= useState();
  const [allCategory, setAllCategory]= useState([{}]);
  const [showRemoveModal, setShowRemoveModal]= useState(false);
  const [questions, setQuestions]=useState([{}]);
  const [questionNew, setQuestionNew] = useState();
  const [allQuestions, setAllQuestions] = useState([{}]);
  const [answerUpdate, setAnswerUpdate]=useState();
  const [questionSelected, setQuestionSelected] = useState([])
  const [questionChanged, setQuestionChanged]=useState(false);


	const onNewCategoryChange =(event)=>{
		setCategory(event.target.value.toUpperCase())
    if(event.target.value) setCategoryDisabled(false);
    else setCategoryDisabled(true);
	}

	const onCategoryUpdateChange =(event)=>{
		setCategoryUpdate(event.target.value.toUpperCase())
	}


  useEffect(() => {
    // Retrieve all Categories
    fetch(`${localIP}/category`)
    .then(response => response.json())
    .then(data => setAllCategory(data))
    // Retrieve all questions
    fetch(`${localIP}/question`)
    .then(response => response.json())
    .then(data => setAllQuestions(data))

  }, []);

  useMemo(()=>{
    if(selectedCategory) {
      const getQuestionByCategory = allQuestions.filter(x=>x.category_id === selectedCategory.category_id);
      setQuestions(getQuestionByCategory);
    }
  }, [allQuestions])

  const onUpdateCategory= async(event)=>{

    const method = "PUT";
    const body = { category_id: selectedCategory.category_id, category: categoryUpdate};
    const url = `${localIP}/category`;
    
    const response = await fetch(url, {
      method: method,
      mode: mode,
      headers: headers,
      body: JSON.stringify(body)
    }).then(response => response.json())
    .then(data => {
      setAllCategory(data);
			alert("Successfully Updated");
    })
    .catch(error => {
      console.error('There was a problem with the Fetch operation:', error);
    })
    
	}

  const onAddCategory  = async(event)=>{

    const method = "POST";
    const body = {category: category};
    const url = `${localIP}/category`;
    
    const response = await fetch(url, {
      method: method,
      mode: mode,
      headers: headers,
      body: JSON.stringify(body)
    }).then(response => response.json())
    .then(data => {
      setAllCategory(data);
       alert("Successfully Added");
    })
    .catch(error => {
      console.error('There was a problem with the Fetch operation:', error);
    })
   
	}

  const [show, setShow] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const handleClose = () => {

    setShow(false)
  };
  const handleShow = (name, table, id) => {
    const data={name: name, table: table, id: id}
    setDeleteItem(data)
    setShow(true);
    
  }

  const handleCreateNewQuestionShow = () => {
    setShowQuestionModal(true)
    setQuestionNew("")
  };
  const handleCreateNewQuestionClose = () => {
    setShowQuestionModal(false)
  };

  const onQuestionNewChange = (event)=>{
    setQuestionNew(event.target.value.toUpperCase())
  }

  const onCreateQuestion = async(event)=>{
    
    const method = "POST";
    const body = {category_id: selectedCategory.category_id, answer: questionNew};
    const url = `${localIP}/question`;
    
    const response = await fetch(url, {
      method: method,
      mode: mode,
      headers: headers,
      body: JSON.stringify(body)
    }).then(response => response.json())
    .then(data => {
      setAllQuestions(data)
       alert("Successfully Added");
    })
    .catch(error => {
      console.error('There was a problem with the Fetch operation:', error);
    });
    
    setShowQuestionModal(false);

	}

  const remove = async()=>{
    const method = "DELETE";
    if(deleteItem.table === "category"){
      const body = {category_id: deleteItem.id};
      const url = `${localIP}/category`;
    
      const response = await fetch(url, {
        method: method,
        mode: mode,
        headers: headers,
        body: JSON.stringify(body)
      }).then(response => response.json())
      .then(data => setAllCategory(data))
      .catch(error => {
        console.error('There was a problem with the Fetch operation:', error);
      });

    }
    if(deleteItem.table === "question"){
      const body = {question_id: deleteItem.id};
      const url = `${localIP}/question`;
    
      const response = await fetch(url, {
        method: method,
        mode: mode,
        headers: headers,
        body: JSON.stringify(body)
      }).then(response => response.json())
      .then(data => setAllQuestions(data))
      .catch(error => {
        console.error('There was a problem with the Fetch operation:', error);
      });

    }
    setShow(false)
    setSelectedCategory([{}]);
    setCategoryUpdate()
  }

  const onCategoryRowClick= async(item)=>{
    console.log("item")
    console.log(item)
    setSelectedCategory(item);
    setCategoryUpdate(item.category)
    const getQuestionByCategory = allQuestions.filter(x=>x.category_id === item.category_id);
    setQuestions(getQuestionByCategory);
    setQuestionSelected([]);
    setImage_1(null);
    setImage_2(null);
    setImage_3(null);
    setImage_4(null);
  }

  const onQuestionRowClick = (question)=>{
    console.log(question)
    setQuestionSelected([question]);
    console.log()
    setImage_1(question.image_1 && question.image_1 !== "null"  ? `${localIP}/${question.image_1}`: "");
    setImage_2(question.image_2 && question.image_2 !== "null" ? `${localIP}/${question.image_2}`: "");
    setImage_3(question.image_3 && question.image_3 !== "null" ? `${localIP}/${question.image_3}`: "");
    setImage_4(question.image_4 && question.image_4 !== "null" ? `${localIP}/${question.image_4}` : "");
    setAnswerUpdate(question.answer)
  }

  const onAnswerChange=(event)=>{
    setQuestionChanged(true);

    setAnswerUpdate(event.target.value.toUpperCase())
  }

  const [image_1, setImage_1]=useState();
  const [image_2, setImage_2]=useState();
  const [image_3, setImage_3]=useState();
  const [image_4, setImage_4]=useState();
  const inputFile_1 = useRef(null);
  const inputFile_2 = useRef(null);
  const inputFile_3 = useRef(null);
  const inputFile_4 = useRef(null);

  const handleFileUpload = (e, imageNumber) => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0].name;

      var parts = filename.split(".");
      const fileType = parts[parts.length - 1];
      console.log("fileType", fileType); //ex: zip, rar, jpg, svg etc.
      if(fileType === "png"  || fileType === "jpeg" || fileType === "jpg"){
        
        if(imageNumber === 1) {
          let getQuestionSelected = questionSelected;
          getQuestionSelected[0].image_1 = files[0];

          setQuestionSelected(getQuestionSelected);
          setQuestionChanged(true)
          setImage_1( URL.createObjectURL(files[0]));
        }
        if(imageNumber === 2) {
          let getQuestionSelected = questionSelected;
          getQuestionSelected[0].image_2 = files[0];

          setQuestionSelected(getQuestionSelected);
          setQuestionChanged(true)
          setImage_2( URL.createObjectURL(files[0]));
        }
        if(imageNumber === 3) {
          let getQuestionSelected = questionSelected;
          getQuestionSelected[0].image_3 = files[0];

          setQuestionSelected(getQuestionSelected);
          setQuestionChanged(true)
          setImage_3( URL.createObjectURL(files[0]));
        }
        if(imageNumber === 4) {
          let getQuestionSelected = questionSelected;
          getQuestionSelected[0].image_4 = files[0];
          setQuestionChanged(true)
          setQuestionSelected(getQuestionSelected);

          setImage_4( URL.createObjectURL(files[0]));
        }
      } 
      else alert("Please enter images like .png and .jpg only");
      
    }
  };

  const onImageUploadClick = (imageNumber) => {
    if(imageNumber === 1) inputFile_1.current.click();
    if(imageNumber === 2) inputFile_2.current.click();
    if(imageNumber === 3) inputFile_3.current.click();
    if(imageNumber === 4) inputFile_4.current.click();
    
  };

  const onSaveQuestion= async()=>{
    const method = "PUT";
    // setImage_1(image_1);
    console.log(questionSelected[0].image_1)

    // const body = {question_id: questionSelected[0].question_id, answer: questionSelected[0].answer};
    let formData = new FormData();

    formData.append("image_1", questionSelected[0].image_1 ?? "");
    formData.append("image_2", questionSelected[0].image_2 ?? "");
    formData.append("image_3", questionSelected[0].image_3 ?? "");
    formData.append("image_4", questionSelected[0].image_4 ?? "");
    formData.append("question_id", questionSelected[0].question_id);
    formData.append("answer", answerUpdate);
    
    const url = `http://localhost:3001/question`;
    
    const response = await fetch(url, {
      method: method,
      mode: mode,
      headers:{
      },
     
      body: formData
    }).then(response => response.json())
    .then(data => setAllQuestions(data))
    .catch(error => {
      console.error('There was a problem with the Fetch operation:', error);
    });
    setQuestionChanged(false)
    alert("Question successfully updated");
  }

  const getBase64 = file => {
      return new Promise(resolve => {
        let fileInfo;
        let baseURL = "";
        // Make new FileReader
        let reader = new FileReader();

        // Convert the file to base64 text
        reader.readAsDataURL(file);

        // on reader load somthing...
        reader.onload = () => {
          // Make a fileInfo Object
          // console.log("Called", reader);
          baseURL = reader.result;
          // console.log(baseURL);
          resolve(baseURL);
        };
        // console.log(fileInfo);
      });
    };
  return (
    <>
      <Container fluid>
       
        <Row>
          <Col md="4">
            {/* Modal Remove */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Warning!</Modal.Title>
              </Modal.Header>
              <Modal.Body >Are you sure you want to remove the"{deleteItem.name}"?</Modal.Body>
              <Modal.Footer>
                <Button style={{background:"red", color:"yellow", borderRadius:"10px", border:"navajowhite", fontSize:"22px"}} variant="secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={()=>remove()}>
                  Remove
                </Button>
              </Modal.Footer>
            </Modal>
            {/* Modal Create New Question */}
            <Modal show={showQuestionModal} onHide={handleCreateNewQuestionClose}>
              <Modal.Header closeButton>
                <Modal.Title>New Question</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                    <Row>
                      <Col className="pr-1" style={{marginLeft: "1rem"}} md="11">
                        <Form.Group>
                          <Form.Control 
                            value={questionNew}
                            placeholder="Enter Answer"
                            type="text"
                            onChange={(event)=>onQuestionNewChange(event)}
                          ></Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button style={{background:"red", color:"yellow", borderRadius:"10px", border:"navajowhite", fontSize:"22px"}} variant="secondary" onClick={handleCreateNewQuestionClose}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={()=>onCreateQuestion()}>
                  Create
                </Button>
              </Modal.Footer>
            </Modal>

            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Categories</Card.Title>
                <p className="card-category">
                  Click an item to display the questions related to the category
                </p>
                <Form>
                  <Row>
                    <Col className="pr-1" md="6">
                      <Form.Group>
                        <label>Category</label>
                        <Form.Control
                          value={category}
                          placeholder="Category Name"
                          type="text"
                          onChange={(event)=>onNewCategoryChange(event)}
                        ></Form.Control>
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="5">
                       <Button disabled={categoryDisabled} style={{marginTop: "1.5rem"}} block onClick={()=>onAddCategory()}   variant="outline-default">
                          New Category
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                { allCategory.length < 1 ? <h3 style={{marginLeft: "1rem"}}>There are currently no Categories...</h3> 
                  : 
                  <Table className="table-hover table-striped">
                    <thead>
                      <tr>
                        <th className="border-0">Category</th>
                      </tr>
                    </thead>
                    <tbody>
        
                        {allCategory.map(items=>{
                          return(
                            <tr id={items.category_id} onClick={()=>{onCategoryRowClick(items)}}>
                              <td>{items.category}</td>
                              <td>
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip >Remove..</Tooltip>
                                  }
                                >
                                  <Button onClick={()=>{handleShow(items.category, "category", items.category_id)}}
                                    className="btn-simple btn-link p-1"
                                    type="button"
                                    variant="danger"
                                  >
                                    <i className="fas fa-times"></i>
                                  </Button>
                                </OverlayTrigger>
                              </td>
                            </tr>

                          )
                        }) }
                    </tbody>
                  </Table>
                }
              </Card.Body>
            </Card>
          </Col>
          {
            selectedCategory  ? 
              <Col md="8">
                <Card className="strpied-tabled-with-hover">
                  <Card.Header>
                    <Card.Title as="h4">Category: {selectedCategory.category}</Card.Title>
                    <p className="card-category">
                      Here you can add upload images and set the answer
                    </p>
                  </Card.Header>
                  <Card.Body className="table-full-width table-responsive px-0">
                    <Form>
                      <Row>
                        <Col className="pr-1" style={{marginLeft: "1rem"}} md="6">
                          <Form.Group>
                            <label>Category</label>
                            <Form.Control
                              value={categoryUpdate}
                              placeholder="Category Name"
                              type="text"
                              onChange={(event)=>onCategoryUpdateChange(event)}
                            ></Form.Control>
                          </Form.Group>
                        </Col>
                        <Col md="4">
                          <Button style={{marginTop: "1.5rem"}} block onClick={()=>onUpdateCategory()} variant="default">
                            Update Category Name
                          </Button>
                        </Col>
                      </Row>
                      
                    </Form>
                    
                  </Card.Body>
                </Card>
                <Card className="strpied-tabled-with-hover">
                  <Card.Header>
                    <Card.Title as="h4">Questions</Card.Title>
                    <p className="card-category">
                      Here you can add upload images and set the answer
                    </p>
                  </Card.Header>
                  <Card.Body className="table-full-width table-responsive px-0">
                    <Form>
                      <Row>
                        <Col className="pr-1" style={{marginLeft: "1rem"}} md="6">
                          <Button style={{marginTop: "1.5rem"}} block onClick={()=>handleCreateNewQuestionShow()} variant="default">
                            New Answer
                          </Button>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="4">
                          <Table className="table-hover table-striped">
                            <thead>
                              <tr>
                                <th className="border-0">Answers</th>
                              </tr>
                            </thead>
                            <tbody>
                              {questions ? questions.map((item)=>{
                                return(
                                  <tr onClick={()=>{onQuestionRowClick(item)}}>
                                    <td>{item.answer}</td>
                                    <td>
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="tooltip-21130535">Remove..</Tooltip>
                                        }
                                      >
                                        <Button
                                          className="btn-simple btn-link p-1"
                                          type="button"
                                          variant="danger"
                                          onClick={()=>{handleShow(item.answer, "question", item.question_id)}}
                                        >
                                          <i className="fas fa-times"></i>
                                        </Button>
                                      </OverlayTrigger>
                                    </td>
                                  </tr>
                                )
                              }): null}
                            </tbody>
                          </Table>
                        </Col>
                        <Col className="pr-1" md="6">
                          {questionSelected.length > 0 ? <Form.Group>
                            {
                              questions.length > 0 ? <Form >
                              <Row>
                                <p style={{textAlign: "center", marginLeft: "1rem"}} className="card-category">
                                  Click the image to upload/change the image
                                </p>
                              </Row>
                              <Row >
                                <Col className="pr-1" md="5.5">
                                  <input
                                    style={{ display: "none" }}
                                    // accept=".zip,.rar"
                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                    ref={inputFile_1}
                                    onChange={(event)=>{handleFileUpload(event,1)}}
                                    type="file"
                                  />
                                  {console.log(questionSelected)}
                                  {
                                    questionSelected[0].image_1 ? <img style={{height: "150px", width: "150px"}} onClick={()=>onImageUploadClick(1)} src={image_1}/> 
                                    : 
                                    <div className="box" style={{ textAlign:"center",  height: "150px", width: "150px"}} onClick={()=>onImageUploadClick(1)}>
                                      Upload
                                    </div>}
                                </Col>
                                <Col className="pr-1" md="5.5">
                                  <input
                                    style={{ display: "none" }}
                                    // accept=".zip,.rar"
                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                    ref={inputFile_2}
                                    onChange={(event)=>{handleFileUpload(event,2)}}
                                    type="file"
                                  />
                                  {
                                    image_2 ? <img style={{height: "150px", width: "150px"}} onClick={()=>onImageUploadClick(2)} src={image_2}/> 
                                    : 
                                    <div className="box" style={{ textAlign:"center",  height: "150px", width: "150px"}} onClick={()=>onImageUploadClick(2)}>
                                      Upload
                                    </div>}
                                </Col>
                              </Row>
                              <Row>
                                <Col className="pr-1" md="5.5">
                                  <input
                                    style={{ display: "none" }}
                                    // accept=".zip,.rar"
                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                    ref={inputFile_3}
                                    onChange={(event)=>{handleFileUpload(event,3)}}
                                    type="file"
                                  />
                                  {
                                    image_3 ? <img style={{height: "150px", width: "150px"}} onClick={()=>onImageUploadClick(3)} src={image_3}/> 
                                    : 
                                    <div className="box" style={{ textAlign:"center",  height: "150px", width: "150px"}} onClick={()=>onImageUploadClick(3)}>
                                      Upload
                                    </div>}
                                </Col>
                                <Col className="pr-1" md="5.5">
                                  <input
                                    style={{ display: "none" }}
                                    // accept=".zip,.rar"
                                    accept="image/png, image/gif, image/jpeg, image/jpg"
                                    ref={inputFile_4}
                                    onChange={(event)=>{handleFileUpload(event, 4)}}
                                    type="file"
                                  />
                                  {console.log(image_4)}
                                  {
                                    image_4 ? <img style={{height: "150px", width: "150px"}} onClick={()=>onImageUploadClick(4)} src={image_4}/> 
                                    : 
                                    <div className="box" style={{ textAlign:"center",  height: "150px", width: "150px"}} onClick={()=>onImageUploadClick(4)}>
                                      Upload
                                    </div>}
                                </Col>
                              </Row>
                              <Row>
                                <Col className="pr-1" md="8">
                                  <Form.Group>
                                    <label>Answer</label>
                                    <Form.Control
                                      value={answerUpdate}
                                      placeholder="Answer"
                                      type="text"
                                      onChange={(event)=>onAnswerChange(event)}
                                    ></Form.Control>
                                  </Form.Group>
                                </Col>
                                <Col className="pr-1" md="4">
                                  <Form.Group>
                                    <Button  style={{marginTop: "1.5rem"}} hidden={!questionChanged} block onClick={()=>onSaveQuestion()} variant="default">
                                      Save
                                    </Button>
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Form> : <Row><Col><h3 style={{marginTop: "2rem", textAlign: "center"}}>There are currently no questions for this category</h3></Col></Row>
                            }
                            
                          </Form.Group> : <h3>No Question Selected</h3>}
                        </Col>
                      </Row>
                    </Form>
                    
                  </Card.Body>
                </Card>
              </Col>
            :
            null
          }
          
        </Row>
      </Container>
    </>
  );
}

export default Categories;
