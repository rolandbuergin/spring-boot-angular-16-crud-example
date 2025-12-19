import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Tutorial } from '../models/tutorial.model';
import { TutorialService } from './tutorial.service';

describe('TutorialService', () => {
  let service: TutorialService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:8080/api/tutorials';
  const tutorial: Tutorial = {
    id: 1,
    title: 'Berlin',
    description: 'Capital city',
    einwohner: 3800000,
    published: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(TutorialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request all tutorials', () => {
    service.getAll().subscribe((response) => expect(response).toEqual([tutorial]));

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush([tutorial]);
  });

  it('should call the expected endpoint for detail, update and delete operations', () => {
    service.get(tutorial.id).subscribe();
    service.update(tutorial.id, tutorial).subscribe();
    service.delete(tutorial.id).subscribe();

    const detail = httpMock.expectOne(`${baseUrl}/${tutorial.id}`);
    expect(detail.request.method).toBe('GET');
    detail.flush(tutorial);

    const update = httpMock.expectOne(`${baseUrl}/${tutorial.id}`);
    expect(update.request.method).toBe('PUT');
    update.flush({ message: 'updated' });

    const deletion = httpMock.expectOne(`${baseUrl}/${tutorial.id}`);
    expect(deletion.request.method).toBe('DELETE');
    deletion.flush({});
  });

  it('should search titles using the provided query parameter', () => {
    const term = 'Berlin';
    service.findByTitle(term).subscribe();
    const req = httpMock.expectOne(`${baseUrl}?title=${term}`);
    expect(req.request.method).toBe('GET');
    req.flush([tutorial]);
  });
});
