const form = document.getElementById('studentForm');
const studentTable = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
const clearBtn = document.getElementById('clearBtn');
const tableContainer = document.querySelector('.table-container');

let students = JSON.parse(localStorage.getItem('students')) || [];
let editIndex = -1; // track if editing
displayStudents();

form.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const id = document.getElementById('studentId').value.trim();
  const className = document.getElementById('className').value.trim();
  const roll = document.getElementById('rollNo').value.trim();
  const email = document.getElementById('email').value.trim();
  const contact = document.getElementById('contact').value.trim();

  // Validation
  if(!/^[a-zA-Z ]+$/.test(name)){alert("Name must be letters only"); return;}
  if(!/^\d+$/.test(id)){alert("ID must be numeric"); return;}
  if(!/^\d+$/.test(roll)){alert("Roll No must be numeric"); return;}
  if(!className){alert("Class cannot be empty"); return;}
  if(!/^\d{10,}$/.test(contact)){alert("Contact must have at least 10 digits"); return;}

  // Duplicate check only if adding new student
  if (editIndex === -1) {
    const duplicate = students.find(s=> s.id===id || s.roll===roll);
    if(duplicate){alert("ID or Roll No already exists!"); return;}
    students.push({name, id, className, roll, email, contact});
  } else {
    // update existing
    students[editIndex] = {name, id, className, roll, email, contact};
    editIndex = -1; // reset after editing
  }

  localStorage.setItem('students', JSON.stringify(students));
  form.reset();
  displayStudents();
});

function displayStudents(){
  studentTable.innerHTML='';
  students.forEach((student,index)=>{
    const row=studentTable.insertRow();
    row.insertCell(0).textContent=student.name;
    row.insertCell(1).textContent=student.id;
    row.insertCell(2).textContent=student.className;
    row.insertCell(3).textContent=student.roll;
    row.insertCell(4).textContent=student.email;
    row.insertCell(5).textContent=student.contact;

    const actions=row.insertCell(6);
    const editBtn=document.createElement('button');
    editBtn.textContent='Edit';
    editBtn.classList.add('edit');
    editBtn.onclick=()=>editStudent(index);

    const deleteBtn=document.createElement('button');
    deleteBtn.textContent='Delete';
    deleteBtn.classList.add('delete');
    deleteBtn.onclick=()=>deleteStudent(index);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
  });
  tableContainer.scrollTop=tableContainer.scrollHeight; // auto-scroll
}

function editStudent(index){
  const student=students[index];
  document.getElementById('name').value=student.name;
  document.getElementById('studentId').value=student.id;
  document.getElementById('className').value=student.className;
  document.getElementById('rollNo').value=student.roll;
  document.getElementById('email').value=student.email;
  document.getElementById('contact').value=student.contact;

  editIndex = index; // set editing index
}


function deleteStudent(index){
  if(confirm("Are you sure you want to delete this record?")){
    students.splice(index,1);
    localStorage.setItem('students',JSON.stringify(students));
    displayStudents();
  }
}


clearBtn.addEventListener('click',()=>{ 
  form.reset(); 
  editIndex = -1; // cancel editing if cleared
});
