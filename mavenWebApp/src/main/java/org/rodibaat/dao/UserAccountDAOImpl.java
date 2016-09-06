package org.rodibaat.dao;

import java.util.List;

import javax.annotation.Resource;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.rodibaat.form.UserAccountForm;
import org.rodibaat.interceptor.RodibatSession;
import org.rodibaat.modal.UserAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class UserAccountDAOImpl implements UserAccountDAO {
	
	@Resource(name="sessionFactory")
    protected SessionFactory sessionFactory;
	
	@Autowired
	RodibatSession rodibatSession;

    public void setSessionFactory(SessionFactory sessionFactory) {
           this.sessionFactory = sessionFactory;
    }
    
    protected Session getSession(){
        return sessionFactory.openSession();
    }
    
	@Override
	public boolean createAccount(String firstName,String lastName, String password,
			String emailId,boolean agreeTerms) {
			
		System.out.println("In Check login");
		Session session = sessionFactory.openSession();
		session.beginTransaction();
		boolean userFound = false;
		
		try {
			//Query using Hibernate Query Language
			UserAccount userAccount = new UserAccount();
			userAccount.setFirstName(firstName);
			userAccount.setLastName(lastName);
			userAccount.setPassword(password);
			userAccount.setEmailId(emailId);
			userAccount.setAgreeTermsConditions(agreeTerms);
			session.save(userAccount);
			session.getTransaction().commit();
			session.close();
			userFound = true;
		} catch(Exception e) {
			System.out.println(e);
		}
		
		return userFound;
	}

	@Override
	@Transactional
	public boolean loginAccount(String emailId, String password) {
		
		Session session = sessionFactory.openSession();
		boolean userFound = false;
		try {
			
			//Query using Hibernate Query Language
			String SQL_QUERY =" from UserAccount as ua where ua.emailId=? and ua.password=?";
			Query query = session.createQuery(SQL_QUERY);
			query.setParameter(0,emailId);
			query.setParameter(1,password);
			List list = query.list();
			if ((list != null) && (list.size() > 0)) {
				userFound= true;
			}
			
			session.close();
			return userFound;  

		} catch(Exception e) {
			System.out.println(e);
		}
		
		return userFound;
	}

	@Override
	@Transactional
	public boolean findAccount(String emailId) {
		Session session = sessionFactory.openSession();
		boolean userFound = false;
		try {
			
			//Query using Hibernate Query Language
			String SQL_QUERY =" from UserAccount as ua where ua.emailId=?";
			Query query = session.createQuery(SQL_QUERY);
			query.setParameter(0,emailId);
			List list = query.list();
			if ((list != null) && (list.size() > 0)) {
				for (Object object : list) {
					UserAccount userAccount = (UserAccount) object;
					rodibatSession.setFirstName(userAccount.getFirstName());
					rodibatSession.setLastName(userAccount.getLastName());
					rodibatSession.setPassword(userAccount.getPassword());
					rodibatSession.setEmailId(userAccount.getEmailId());
					rodibatSession.setLoggedIn(true);
				}
				userFound= true;
			}
			
			session.close();

		} catch(Exception e) {
			System.out.println(e);
		}
		return userFound;
	}

}
