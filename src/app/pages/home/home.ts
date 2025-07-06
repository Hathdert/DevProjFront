import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {


  offers = [
    {
      id: 1,
      title: 'Frontend Internship',
      description: 'Join our team as a frontend intern and help build amazing web interfaces.',
      requirements: 'Knowledge of Angular, HTML, CSS, and JavaScript.',
      area: 'Frontend Development',
      startDate: '2025-09-01',
      endDate: '2026-03-01',
      vacancies: 2,
      company: {
        name: 'TechBridge Solutions'
      },
      isOffer: true,
      image: 'assets/images/frontend.JPG'
    },
    {
      id: 2,
      title: 'Backend Internship',
      description: 'Work with our experienced backend team to develop REST APIs.',
      requirements: 'Familiar with Java, Spring Boot, and databases.',
      area: 'Backend Development',
      startDate: '2025-10-01',
      endDate: '2026-04-01',
      vacancies: 3,
      company: {
        name: 'DataStream Corp'
      },
      isOffer: true,
      image: 'assets/images/backend.JPG'
    },
    {
      id: 3,
      title: 'UI/UX Design Internship',
      description: 'Collaborate with our design team to craft beautiful user experiences.',
      requirements: 'Experience with Figma or Adobe XD.',
      area: 'Design',
      startDate: '2025-08-15',
      endDate: '2026-02-15',
      vacancies: 1,
      company: {
        name: 'Creative Minds Studio'
      },
      isOffer: true,
      image: 'assets/images/uiux.JPG'
    }
  ];
}
